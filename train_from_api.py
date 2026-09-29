"""
SurSetu - High-Throughput Dataset API Trainer (Expanded Edition)
--------------------------------------------------------------------
Harvests hundreds of canonical educational, pedagogical, scientific, and
conversational sentence pairs via Neural Dataset API, automatically generates
multi-script representations (Ol Chiki, Odia, Devanagari, Latin), and compiles
them into 'datasets/learned_memory.json' and 'datasets/santali_dictionary.json'.
"""

import concurrent.futures
import json
import os
import sys
import time
import urllib.parse
import urllib.request

# Force UTF-8 encoding
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from translation_engine import transduce_script

MEMORY_FILE = os.path.join(PROJECT_ROOT, "datasets", "learned_memory.json")
DICT_FILE = os.path.join(PROJECT_ROOT, "datasets", "santali_dictionary.json")

# Massive Curated Educational, Scientific, Cultural & Conversational Prompts
TRAINING_PROMPTS = [
    # 1. School, Classroom, Education & Pedagogy
    "The teacher is writing on the blackboard",
    "Students are listening carefully to the teacher",
    "Open your textbook to page number ten",
    "Please read the first lesson loudly",
    "Write your name and village name on the paper",
    "Today we will study mathematics and science",
    "Do you have a pen and a notebook?",
    "I have finished my homework",
    "Please give me a pencil and eraser",
    "The school bell is ringing",
    "Children are playing football in the school ground",
    "We go to school every day in the morning",
    "Who is the principal of our school?",
    "She is the best student in our class",
    "We learn Ol Chiki script in our school",
    "Pandit Raghunath Murmu created the Ol Chiki script",
    "Education gives us knowledge and power",
    "Sit down quietly in your seats",
    "Do not make noise in the classroom",
    "Ask your teacher if you have any questions",
    "Please raise your hand before speaking",
    "We should respect our teachers and parents",
    "Where is the school library located?",
    "I love reading stories and poems in Santali",
    "Draw a picture of a tree and a flower",
    "The students are answering questions in the exam",
    "Please submit your notebook to the teacher",
    "We sing our school prayer together every morning",
    "Keep your books and bags in proper order",
    "Clean the blackboard after every class",
    "Today is our school annual sports day",
    "She won the first prize in drawing competition",

    # 2. Mathematics, Arithmetic, Fractions & Measurements
    "Two plus two is equal to four",
    "Five multiplied by five is twenty-five",
    "Ten minus three is equal to seven",
    "Count the numbers from one to twenty",
    "How many days are there in a week?",
    "There are seven days in a week",
    "There are twelve months in a year",
    "Measure the length of the table with a ruler",
    "A triangle has three sides and three corners",
    "A square has four equal sides",
    "A circle has no corners",
    "How many students are there in the class?",
    "There are forty students in our classroom",
    "Divide the apples equally among four children",
    "What is the total price of five books?",
    "One hundred rupees is enough to buy books",
    "Half of ten is five",
    "Add fifty and fifty to make one hundred",
    "One kilogram of rice has one thousand grams",
    "One kilometer is equal to one thousand meters",
    "Count the coins in your pocket",
    "This box is heavier than that bag",

    # 3. Science, Human Body, Health & Five Senses
    "We see beautiful things with our eyes",
    "We hear music and sounds with our ears",
    "We smell sweet flowers with our nose",
    "We taste delicious food with our tongue",
    "We feel hot and cold with our skin",
    "The human heart pumps blood to the whole body",
    "Lungs help us breathe fresh air",
    "Bones give shape and strength to our body",
    "Drink clean boiled water every day",
    "Eat balanced nutritious food to stay healthy",
    "Wash your hands with soap before eating",
    "Brush your teeth twice every day",
    "Do exercise and yoga in the morning",
    "Clean drinking water protects us from sickness",
    "Take rest when you feel tired",
    "The doctor gave medicine to cure the fever",
    "Anganwadi center provides nutrition to small children",
    "Vaccination protects children from dangerous diseases",

    # 4. Nature, Environment, Forest & Solar System
    "The sun rises in the east and sets in the west",
    "Plants need sunlight, water and air to grow",
    "Water flows down the mountain river",
    "Green leaves prepare food for the plant",
    "We should plant more trees to protect nature",
    "Forests provide clean air, rain and wood",
    "Birds make their nests in the branches of tall trees",
    "The peacock is the national bird of India",
    "The tiger is a wild animal living in the deep forest",
    "Cows give us healthy milk to drink",
    "During the rainy season, flowers bloom everywhere",
    "The sky is full of bright stars at night",
    "The moon reflects light from the sun",
    "Earth revolves around the sun in three hundred sixty-five days",
    "Sal tree is sacred to our tribal people",
    "Mahua flowers are collected in early summer",
    "The elephant herd is walking through the green forest",
    "Rainwater should be conserved in ponds and check dams",
    "Do not cut green trees without planting new ones",
    "The river water is crystal clear and cool",

    # 5. Tribal Heritage, Culture, History & Festivals
    "Sidhu and Kanhu led the historic Santhal rebellion",
    "Birsa Munda fought bravely for tribal freedom and land rights",
    "Tilka Majhi was the first tribal freedom fighter of India",
    "Pandit Raghunath Murmu is the father of Ol Chiki script",
    "We celebrate the Baha festival with singing and dancing",
    "Sohrai is our greatest harvest festival of joy",
    "Mage Parab is celebrated with traditional enthusiasm",
    "People play the Tamak and Tumdak drums joyfully",
    "Women dance gracefully in a semi-circle chain",
    "Everyone gathered at the village Jaher Than for worship",
    "We respect our ancestors and preserve our cultural traditions",
    "Santali language is recognized in the Eighth Schedule of Constitution",
    "Our tribal art and wall paintings are very colorful",
    "Mayurbhanj is rich in tribal culture and natural beauty",

    # 6. Village Community, Governance & Daily Routines
    "Farmers sow seeds when the monsoon rains arrive",
    "Paddy fields are shining green in the morning sun",
    "He is plowing the field with two strong bullocks",
    "We harvest ripe golden paddy in winter",
    "The village headman resolves disputes in the Panchayat",
    "All villagers participate in the Gram Sabha meeting",
    "Where is the nearest primary health center?",
    "We fetch drinking water from the village tube well",
    "My mother is cooking rice and vegetables in the kitchen",
    "My father works hard in the agricultural fields",
    "My grandfather tells traditional Santali folk tales",
    "My friend lives in the neighboring village",
    "We are going to the weekly village market today",
    "Fresh vegetables, rice and mustard oil are sold in the market",
    "How much does one kilogram of potatoes cost?",
    "Please give me two kilograms of fresh onions",

    # 7. Conversational Dialogues, Transport & Directions
    "What is your name and where do you live?",
    "My name is Sarthak and I live in Mayurbhanj",
    "Can you speak Santali fluently?",
    "Yes, I speak Santali, Odia and English",
    "Which language do you speak at home with family?",
    "How far is the railway station from our village?",
    "Go straight and then turn right at the crossroad",
    "What time is it right now?",
    "It is ten o'clock in the morning",
    "Why are you late for school today?",
    "I was late because of heavy rainfall on the road",
    "When will the bus arrive at the village stand?",
    "The bus will arrive in twenty minutes",
    "What do you want to become when you grow up?",
    "I want to become a teacher and educate children",
    "I want to become a doctor and help poor patients",
    "May I come into the classroom, teacher?",
    "Yes, please come in and sit down quietly",
    "Thank you very much for your kind help",
    "You are always welcome in our village",
    "Have a safe and pleasant journey",
    "See you again tomorrow morning at school",
    "Where can I buy fresh milk and honey?",
    "The shop is located behind the village post office",

    # 8. Civics, Indian Constitution, Rights & Governance
    "The Constitution of India guarantees fundamental rights to all citizens",
    "Right to education is a fundamental right for every child",
    "Gram Panchayat works for the overall development of the village",
    "The Sarpanch and Ward Members are elected by the villagers",
    "Gram Sabha meetings are held to discuss village issues and schemes",
    "Citizens have the right to vote in democratic elections",
    "The Indian Constitution promotes equality, justice and liberty",
    "Forest Rights Act protects the rights of tribal communities",
    "Panchayats Extension to Scheduled Areas Act gives power to Gram Sabha",
    "Every citizen should perform their fundamental duties sincerely",
    "The government provides free education and mid-day meals in schools",
    "Law and order are maintained for peace and security in society",
    "Public property belongs to everyone and must be protected",

    # 9. Agriculture, Organic Farming, Irrigation & Soil Health
    "Agriculture is the main livelihood of our rural families",
    "Farmers use organic compost to improve soil fertility",
    "Crop rotation prevents soil degradation and increases yield",
    "Drip irrigation saves water and provides moisture directly to roots",
    "Paddy, maize, pulses and mustard are the major crops grown here",
    "Rainwater harvesting ponds help irrigate fields during dry seasons",
    "Earthworms are the best friends of farmers in the soil",
    "Avoid using harmful chemical pesticides on green crops",
    "The government announces minimum support price for agricultural crops",
    "Farmers sell their harvest in the government procurement center",
    "Millets and ragi are highly nutritious traditional grains",
    "Cattle shed must be cleaned every morning and evening",
    "Goats, sheep and poultry provide extra income to tribal farmers",
    "Veterinary doctor vaccinates cattle against foot and mouth disease",
    "Store harvested grains in dry and moisture-proof containers",

    # 10. Technology, Computers, Internet & Renewable Energy
    "Computers and smart phones have made communication very fast",
    "The internet allows us to learn new things from anywhere",
    "Solar panels generate clean electrical energy from sunlight",
    "Streetlights in our village operate on solar energy",
    "Mobile banking helps villagers transfer money safely",
    "Students learn digital skills in the computer lab",
    "Electricity powers light bulbs, fans and water pumps",
    "Television and radio broadcast educational programs for children",
    "Use mobile phones carefully and avoid excessive screen time",
    "Artificial intelligence is transforming modern technology",
    "Digital literacy empowers people in rural areas",
    "Online study materials help students prepare for competitive exams",

    # 11. Health, Sanitation, First Aid & Emergency Preparedness
    "Wash your hands thoroughly with soap before preparing or eating food",
    "Oral rehydration solution saves life during severe dehydration",
    "Boil water before drinking to kill harmful bacteria and germs",
    "Keep your surroundings clean to prevent mosquito breeding",
    "Sleep inside mosquito nets to protect against malaria and dengue",
    "In case of a snake bite, rush the patient to the hospital immediately",
    "Do not tie tight tourniquets or cut the wound during a snake bite",
    "Clean the cut with antiseptic lotion and cover it with a sterile bandage",
    "Pregnant mothers should receive regular checkups at the health center",
    "Anganwadi workers provide iron and folic acid tablets to mothers",
    "Proper sanitation and use of toilets prevent infectious diseases",
    "Call the ambulance number one zero eight in case of emergency",
    "Cover your mouth and nose when coughing or sneezing",
    "Good mental health and physical fitness keep us active and happy",

    # 12. Ecology, Forest Biodiversity, Climate & Wildlife
    "Forests are the home of diverse birds, animals and medicinal plants",
    "Trees absorb carbon dioxide and release oxygen into the atmosphere",
    "The water cycle consists of evaporation, condensation and precipitation",
    "Sal, Teak, Kendu, and Mahua are valuable trees in our forests",
    "Tribal people have preserved sacred groves for centuries",
    "Soil erosion can be prevented by planting grass and trees on slopes",
    "Deforestation causes climate change and global warming",
    "Plastic waste pollutes our soil, rivers and water bodies",
    "Do not throw plastic bags or bottles in open fields",
    "We should segregate wet and dry waste in separate dustbins",
    "Wild animals maintain the natural balance of the ecosystem",
    "Simlipal National Park is famous for tigers, elephants and waterfalls",

    # 13. Santali Literature, Great Leaders, Freedom Fighters & Philosophy
    "Pandit Raghunath Murmu was born in Dandbose village in Mayurbhanj",
    "He invented the Ol Chiki script in the year nineteen twenty-five",
    "Bidu Chandan is a famous philosophical drama written in Ol Chiki",
    "Sidhu, Kanhu, Chand and Bhairav sacrificed their lives in the Hul rebellion",
    "Phulo and Jhano fought valiantly against British forces",
    "Birsa Munda declared that the land belongs to the people of the soil",
    "Santali literature has received the Sahitya Akademi Award",
    "Majhi Pargana system is the traditional democratic governance of Santhals",
    "Godet, Naike and Kudam Naike perform important roles in village customs",
    "We sing traditional Kudum riddles and folk songs during evening gatherings",
    "Preserving our native language strengthens our cultural identity",

    # 14. Advanced Mathematics, Geometry, Fractions & Time
    "A rectangle has four sides with opposite sides equal",
    "The perimeter of a square is four times the length of one side",
    "The area of a rectangle is length multiplied by breadth",
    "Three-fourths is greater than one-half",
    "Convert five kilometers into meters by multiplying by one thousand",
    "There are sixty minutes in one hour and sixty seconds in one minute",
    "The clock shows half past three in the afternoon",
    "If one notebook costs twenty rupees, ten notebooks cost two hundred rupees",
    "Calculate the percentage of marks obtained in the annual examination",
    "A circle has a center point, radius and diameter",
    "Subtract twenty-five from seventy-five to get fifty",
    "The speed of a moving bus is forty kilometers per hour",

    # 15. Practical Daily Dialogues (Bank, Market, Hospital, Station)
    "Where is the nearest bank branch to deposit money?",
    "Please help me fill out the bank withdrawal slip",
    "I want to open a new savings account in this branch",
    "How do I use this ATM card to withdraw cash?",
    "What is the platform number for the morning train to Bhubaneswar?",
    "Please give me two railway tickets to Rourkela",
    "Where is the ticket counter located at the station?",
    "Doctor, I have a headache and mild fever since yesterday",
    "Take these tablets twice daily after meals with water",
    "Is this vegetable fresh from the morning harvest?",
    "Give me one liter of cooking mustard oil and one packet of salt",
    "What is the total bill for these grocery items?",
    "Can I pay using online digital UPI payment?",
    "Thank you very much for your kind assistance",
    "I will return your book tomorrow during lunchtime",
    "Let us work together to keep our school and village clean",

    # 16. Comprehensive Hindi Curricula Pairs
    "नमस्ते, आप सब कैसे हैं?",
    "आज हम सब मिलकर गणित और विज्ञान पढ़ेंगे।",
    "कृपया अपनी किताब का पहला पाठ खोलें।",
    "शिक्षक कक्षा में श्यामपट्ट पर लिख रहे हैं।",
    "साफ पानी पियो और हमेशा हाथ धोकर खाना खाओ।",
    "हमारा गांव बहुत सुंदर और हरा-भरा है।",
    "संताली भाषा हमारी मातृभाषा और शान है।",
    "पेड़-पौधे हमें छाया, फल और शुद्ध हवा देते हैं।",
    "परिश्रम करने से ही जीवन में सफलता मिलती है।",
    "सबको जोहार और शुभ प्रभात।",
    "सिद्धू और कान्हू ने संताल विद्रोह का नेतृत्व किया था।",
    "पंडित रघुनाथ मुर्मू ने ओल चिकी लिपि की रचना की थी।",
    "बिरसा मुंडा हमारे महान स्वतंत्रता सेनानी हैं।",
    "बाहा और सोहराय हमारे प्रमुख लोक पर्व हैं।",
    "तामाक और तुमदाक हमारे पारंपरिक वाद्य यंत्र हैं।",
    "स्वच्छता ही स्वास्थ्य की कुंजी है।",
    "समय का हमेशा सदुपयोग करना चाहिए।",
    "प्रतिदिन विद्यालय जाना और मन लगाकर पढ़ना चाहिए।",
    "भारतीय संविधान सभी नागरिकों को मौलिक अधिकार प्रदान करता है।",
    "शिक्षा का अधिकार हर बच्चे का बुनियादी अधिकार है।",
    "ग्राम पंचायत गांव के विकास के लिए काम करती है।",
    "सौर ऊर्जा से हमारे गांव की बत्तियां जलती हैं।",
    "कंप्यूटर और इंटरनेट से ज्ञान प्राप्त करना आसान हो गया है।",
    "किसान हमारे देश के अन्नदाता हैं।",
    "जैविक खाद के उपयोग से मिट्टी की उपजाऊ शक्ति बढ़ती है।",
    "मलेरिया से बचने के लिए मच्छरदानी का उपयोग करें।",
    "ओआरएस का घोल निर्जलीकरण से जान बचाता है।",
    "सांप काटने पर मरीज को तुरंत नजदीकी अस्पताल ले जाएं।",
    "वनों की रक्षा करना हम सभी का परम कर्तव्य है।",
    "जल ही जीवन है, पानी की हर बूंद को बचाएं।",
    "मयूरभंज की प्राकृतिक सुंदरता अद्भुत और मनमोहक है।",
    "कड़ी मेहनत और अनुशासन से ही बड़ा लक्ष्य हासिल होता है।",
    "सड़क पार करते समय हमेशा दोनों तरफ ध्यान से देखें।",
    "पुस्तकालय में बैठकर शांति से अध्ययन करना चाहिए।",
    "हम सब मिलकर अपने गांव को स्वच्छ और सुंदर बनाएंगे।",

    # 17. Seasons, Weather, Climate, Rain & Wind
    "Summer days are very hot and sunny in our region",
    "Dark monsoon clouds bring heavy rain to the village",
    "Lightning flashed across the sky followed by loud thunder",
    "A colorful seven-color rainbow appeared in the eastern sky",
    "Cool gentle breezes blow through the sal trees in spring",
    "Morning dew drops shine like pearls on green grass in winter",
    "Winter mornings are cold and covered with thick white fog",
    "Heavy rainfall filled all village ponds and streams to the brim",
    "Farmers welcome the first rain of the rainy season with joy",
    "The autumn sky is clear and deep blue with white clouds",

    # 18. Santali Traditional Occupations, Crafts, Tools & Materials
    "The village blacksmith makes iron sickles, axes and ploughshares",
    "Women weave beautiful bamboo baskets and mats skillfully",
    "The potter shapes earthen pots, water jars and cooking vessels on the wheel",
    "Carpenters make wooden doors, windows, tables and carts",
    "Hunters carry traditional bows, arrows and spears with honor",
    "Traditional Santali houses are built with mud walls and tiled roofs",
    "Clay walls are painted with beautiful natural floral patterns",
    "Rope is made from dry grass and tree bark fibers",
    "The weaver uses handloom to weave traditional cotton towels and sarees",
    "Tamak and Tumdak drums are handcrafted with seasoned wood and leather",

    # 19. Geography, Rivers, Mountains & Regional Landforms
    "The Subarnarekha and Baitarani rivers flow through our tribal land",
    "Mayurbhanj is surrounded by green hills and dense forests",
    "The Himalayas are the highest mountains in the world",
    "The ocean is vast and contains deep blue salty water",
    "India has twenty-eight states and eight union territories",
    "Look at the world map to find continents and oceans",
    "The hill slope is covered with green terrace farms",
    "A fresh water spring emerges from the foot of the hill",
    "Valleys between high hills have fertile soil for crops",
    "The plateau region is rich in iron ore and minerals",

    # 20. Family Kinship, Social Bonds & Community Living
    "My grandmother tells us enchanting folklore around the fire",
    "We love and care for our younger brothers and sisters",
    "Respect your uncles, aunts and elderly relatives in the village",
    "The entire village community gathers to celebrate weddings and festivals",
    "Neighbors help each other during harvesting and house construction",
    "Children play joyful traditional games in the courtyard",
    "Parents work tirelessly to provide education and a bright future for children",
    "Unity and mutual cooperation make our village strong and prosperous",
    "We greet our guests with folded hands and offer cool drinking water",
    "Elder brothers and sisters guide younger children in their studies",

    # 21. Nutrition, Traditional Recipes & Santali Cuisine
    "Boiled rice, dal, and fresh green leafy vegetables make a wholesome meal",
    "Jil Pitha is a delicious traditional meat-filled rice cake",
    "Panta Bhat with mustard oil and onion is refreshing in summer",
    "Mahua flowers are dried in the sun to make nutritious sweets",
    "Fresh drumstick leaves and mushroom curry are rich in vitamins",
    "Papaya, guava, mango and berries provide essential minerals",
    "Never skip breakfast before going to school in the morning",
    "Drink warm milk and eat boiled eggs for physical growth",
    "Fresh homemade food is much healthier than packaged snacks",
    "Lentils and pulses build strong muscles and tissues",

    # 22. Financial Literacy, Banking, Self Help Groups & Welfare Schemes
    "Open a bank savings account to deposit your hard-earned money safely",
    "Women in Self Help Groups save money and start small businesses",
    "Do not share your bank ATM PIN or mobile OTP with anyone",
    "The post office offers reliable small savings and insurance schemes",
    "Crop insurance protects farmers against drought and flood damage",
    "Take loans from banks rather than high-interest moneylenders",
    "Old age pension provides monthly financial support to senior citizens",
    "Keep your bank passbook updated with every transaction",
    "Government subsidies help small farmers purchase modern farm equipment",
    "Saving small amounts every month creates financial security for the family",

    # 23. Computer Science, Hardware, Software & Internet Terminology
    "A computer keyboard is used to type letters, numbers and symbols",
    "Click the computer mouse to select files and open programs",
    "The monitor screen displays text, images, videos and software",
    "A printer prints digital documents onto physical paper",
    "Always choose a strong, secret password for your online accounts",
    "Electronic mail allows us to send messages and files instantly",
    "Websites provide information about education, government and news",
    "Video calling connects people living thousands of miles apart",
    "Software applications make our daily tasks faster and easier",
    "Learn coding and computer programming to create useful software",

    # 24. Moral Education, Santali Proverbs, Folk Tales & Ethics
    "Honesty is the most valuable quality of a good human being",
    "Kindness to animals and plants shows a noble and compassionate heart",
    "Never speak falsehood or deceive your friends and family",
    "Hard work and perseverance overcome all difficulties in life",
    "Listen patiently to the wisdom and advice of village elders",
    "Helping the needy and helpless brings true inner happiness",
    "Knowledge is a treasure that increases the more you share it",
    "Be punctual and fulfill your promises without delay",
    "Peace, love and harmony are the foundations of a happy society",
    "True bravery is standing up for justice and truth",

    # 25. Extended Bilingual Hindi Sentences
    "ग्रीष्म ऋतु में दिन बहुत गर्म और धूप वाले होते हैं।",
    "काले मानसूनी बादल गांव में मूसलाधार बारिश लाते हैं।",
    "आकाश में सात रंगों वाला सुंदर इंद्रधनुष दिखाई दिया।",
    "शीत ऋतु में सुबह के समय घना कोहरा छाया रहता है।",
    "गांव के लोहार लोहे के हंसिए, कुल्हाड़ी और हल बनाते हैं।",
    "महिलाएं बांस की सुंदर टोकरियां और चटाइयां बनाती हैं।",
    "कुम्हार चाक पर मिट्टी के घड़े, सुराही और बर्तन बनाता है।",
    "सुवर्णरेखा और बैतरणी नदियां हमारे क्षेत्र से होकर बहती हैं।",
    "मयूरभंज हरी पहाड़ियों और घने जंगलों से घिरा हुआ है।",
    "दादी मां शाम को हमें लोककथाएं और पहेलियां सुनाती हैं।",
    "गांव के सभी लोग मिलकर शादी और त्योहार मनाते हैं।",
    "दाल-चावल और हरी सब्जियां खाने से शरीर स्वस्थ रहता है।",
    "बैंक में बचत खाता खोलकर अपनी गाढ़ी कमाई सुरक्षित रखें।",
    "स्वयं सहायता समूह की महिलाएं आत्मनिर्भर बन रही हैं।",
    "अपना एटीएम पिन या ओटीपी किसी के साथ साझा न करें।",
    "कंप्यूटर कीबोर्ड से अक्षर और संख्याएं टाइप की जाती हैं।",
    "ईमेल से संदेश और दस्तावेज तुरंत भेजे जा सकते हैं।",
    "सच्चाई और ईमानदारी ही जीवन का सबसे बड़ा गुण है।",
    "कठिन परिश्रम और धैर्य से हर मुश्किल आसान हो जाती है।",
    "पशु-पक्षियों और प्रकृति के प्रति दयाभाव रखना चाहिए।",
    "विद्या ऐसा धन है जो बांटने से और अधिक बढ़ता है।",
    "सदा समय का पालन करो और अपना वादा पूरा करो।",
    "शांति और एकता से ही समाज में सुख-समृद्धि आती है।",

    # 26. National Symbols, Festivals, Independence & Republic Day
    "The tricolor is the national flag of our country India",
    "The saffron color stands for courage and sacrifice",
    "The white color represents peace, truth and purity",
    "The green color signifies fertility, growth and prosperity of the land",
    "The Ashoka Chakra in the center has twenty-four spokes",
    "We celebrate Independence Day on the fifteenth of August every year",
    "Republic Day is celebrated on the twenty-sixth of January",
    "Jana Gana Mana is the national anthem of our country",
    "Vande Mataram is our revered national song",
    "We salute the brave soldiers who protect our country's borders",

    # 27. Biology, Insects, Birds, Aquatic Animals & Life Cycles
    "Honeybees collect nectar from sweet flowers and make sweet honey",
    "A butterfly transforms from a caterpillar through a beautiful metamorphosis",
    "Frogs can live both on land and in fresh water",
    "Fish breathe underwater using their delicate gills",
    "Earthworms enrich the agricultural soil by creating humus",
    "Ants work together in great discipline and store food for rainy days",
    "Birds have hollow bones and light feathers that help them fly high",
    "Spiders spin strong silk webs to catch flying insects",
    "Trees lose their old dry leaves and grow fresh green buds in spring",
    "The green pigment chlorophyll helps plants capture sunlight for photosynthesis",

    # 28. Physics & Chemistry - States of Matter, Heat, Light & Sound
    "Matter exists in three main states: solid, liquid and gas",
    "Ice melts into water when heated above zero degrees Celsius",
    "Water boils and turns into steam at one hundred degrees Celsius",
    "Light travels faster than sound in the atmosphere",
    "We see lightning before we hear the roar of thunder",
    "A magnet attracts objects made of iron and nickel",
    "The north pole of a magnet repels another north pole",
    "Sound cannot travel through an empty vacuum",
    "Friction between surfaces creates heat and slows down movement",
    "Sunlight is made of seven beautiful colors combined together",

    # 29. Agriculture, Sericulture (Tasar Silk), Fishery & Dairy Farming
    "Mayurbhanj is famous for producing high-quality Tasar silk cocoons",
    "Silkworms feed on Asan and Arjun tree leaves in the forest",
    "Fish farming in village ponds provides protein and good income",
    "Dairy cows need clean water, green fodder and dry straw daily",
    "Poultry farming produces fresh eggs and chicken for local markets",
    "Bee-keeping boxes are placed in mustard and sunflower fields",
    "Soil testing helps farmers determine the required nutrients for crops",
    "Sprinkling water on seedlings in early morning protects them from frost",
    "Store seeds in airtight clay pots mixed with neem leaves to prevent pests",
    "Compost manure made from cattle dung enriches the garden soil naturally",

    # 30. Road Safety, Traffic Signs & Disaster Preparedness
    "Always wear a helmet while riding a motorcycle or scooter",
    "Cross the busy road carefully at the zebra crossing",
    "Red light means stop, yellow means wait, and green means go",
    "Do not use mobile phones while driving or riding a bicycle",
    "Look left, right and left again before stepping onto the road",
    "During an earthquake, stay calm and take shelter under a strong table",
    "Move to high ground immediately when there is a risk of sudden flood",
    "Do not touch broken electrical wires hanging on trees or roads",
    "Keep a flashlight, emergency radio and first aid kit ready at home",
    "Teach young children their home address and parents' mobile numbers",

    # 31. Public Services, Post Office, Police Station & Hospital
    "The postman delivers letters, money orders and parcels to our doorstep",
    "Speed post delivers important letters and documents quickly across the country",
    "The police station maintains law, safety and order in the local area",
    "Doctors and nurses provide round-the-clock medical care in hospitals",
    "Firefighters bravely extinguish dangerous fires and rescue trapped people",
    "The forest department protects wild animals and prevents illegal tree cutting",
    "The public distribution shop provides rice, wheat and sugar at fair prices",
    "The village library provides daily newspapers and educational magazines",
    "Drinking water supply pipelines bring clean water to every household",
    "Solar streetlights keep village streets bright and safe during night",

    # 32. Extensive Hindi Educational & Curricular Expansion
    "तिरंगा हमारे देश भारत का राष्ट्रीय ध्वज है।",
    "केसरिया रंग साहस और बलिदान का प्रतीक है।",
    "सफेद रंग शांति, सत्य और पवित्रता का संदेश देता है।",
    "हरा रंग देश की समृद्धि और हरियाली को दर्शाता है।",
    "अशोक चक्र में चौबीस तीलियां होती हैं।",
    "हम हर वर्ष 15 अगस्त को स्वतंत्रता दिवस मनाते हैं।",
    "26 जनवरी को गणतंत्र दिवस बड़े उत्साह से मनाया जाता है।",
    "मधुमक्खियां फूलों से रस इकट्ठा करके शहद बनाती हैं।",
    "तितली का जीवन चक्र बहुत सुंदर और प्रेरणादायक होता है।",
    "मछलियां गलफड़ों की सहायता से पानी में सांस लेती हैं।",
    "मयूरभंज तसर रेशम के उत्पादन के लिए विश्वभर में प्रसिद्ध है।",
    "रेशम के कीड़े असन और अर्जुन के पत्तों को खाते हैं।",
    "सड़क पार करते समय हमेशा जेब्रा क्रॉसिंग का उपयोग करें।",
    "दुपहिया वाहन चलाते समय हमेशा हेलमेट पहनना चाहिए।",
    "लाल बत्ती का अर्थ रुकना और हरी बत्ती का अर्थ चलना है।",
    "डाकिया हमारे घर-घर जाकर चिट्ठियां और पार्सल पहुंचाता है।",
    "डॉक्टर और नर्स अस्पताल में मरीजों की सेवा करते हैं।",
    "पुलिस हमारे समाज में शांति और सुरक्षा बनाए रखती है।",
    "पेड़-पौधे पर्यावरण का संतुलन बनाए रखते हैं।",
    "प्राकृतिक संसाधनों का संरक्षण करना हमारा कर्तव्य है।",

    # 33. Human Anatomy, Organs, Blood Circulation & Immunity
    "The human brain controls all thoughts, memory and body movements",
    "Red blood cells carry oxygen from the lungs to every cell of the body",
    "The stomach and intestines digest food and absorb vital nutrients",
    "Kidneys filter waste products and excess water from the bloodstream",
    "The liver plays a key role in processing energy and eliminating toxins",
    "The human skeletal system has two hundred and six bones in adults",
    "White blood cells are the brave soldiers that fight against infections",
    "Regular physical exercise makes the heart and lungs strong and resilient",
    "Adequate eight hours of sleep is necessary for mental and physical health",
    "Drinking enough water keeps the body well-hydrated and energetic",

    # 34. Earth Sciences, Continents, Oceans & Geological Wonders
    "The Earth is divided into seven continents and five major oceans",
    "Asia is the largest continent with diverse cultures and languages",
    "The Pacific Ocean is the deepest and largest ocean on Earth",
    "Volcanoes erupt molten lava, ash and gases from deep inside the Earth",
    "Glaciers are massive rivers of ice moving slowly down mountain valleys",
    "The equator divides the Earth into northern and southern hemispheres",
    "Deserts receive very little rainfall and have specialized plants like cactus",
    "Tides in the ocean are caused by the gravitational pull of the moon",
    "Fossils are preserved remains of ancient plants and animals in rocks",
    "Earthquakes are measured on the Richter scale by seismograph instruments",

    # 35. Traditional Santali Mythology, Origin Tales & Folk Legends
    "Pilchu Haram and Pilchu Budhi are the revered first ancestors of Santhals",
    "Marang Buru is the supreme guardian spirit in Santali traditional belief",
    "Jaher Era is worshipped at the sacred Jaher Than grove for village welfare",
    "The historic Santhal folklore narrates our journey through Champa Garh",
    "Traditional Santali clans or Paris include Murmu, Hembrom, Marndi and Soren",
    "Tudu, Hansda, Besra, Baskey and Kisku are respected tribal lineages",
    "The village priest or Naike offers prayers for bumper harvests and health",
    "Kudum riddles challenge the wit and creativity of children during festivals",
    "Oral storytelling preserves the glorious history of our tribal ancestors",
    "Respect for mother nature is the core philosophy of tribal living",

    # 36. Traditional Musical Instruments, Songs & Tribal Sports
    "The Banam is an ancient bowed string instrument carved from wood",
    "The Tirio is a melodious bamboo flute played during spring festivals",
    "Tamak is a large bowl-shaped kettle drum beaten with heavy wooden sticks",
    "Tumdak is a double-headed hand drum hung around the neck of the drummer",
    "Kati is a popular traditional Santali team sport played with wooden discs",
    "Archery competitions with bow and arrow showcase traditional marksmanship",
    "Dahar, Sohrai, Baha and Golwari are melodious traditional song genres",
    "Men and women dance rhythmically in concentric circles to drum beats",
    "Traditional flute music echoes peacefully through the evening forests",
    "Tribal sports build agility, endurance, teamwork and friendship",

    # 37. Elements, Minerals, Metals & Everyday Chemistry
    "Oxygen is the vital gas required by humans and animals for respiration",
    "Carbon dioxide is taken in by green plants during the process of photosynthesis",
    "Common table salt is composed of sodium and chlorine elements",
    "Iron is a strong metal used for making bridges, vehicles and tools",
    "Gold and silver are precious shining metals used for traditional jewelry",
    "Copper and aluminium are excellent conductors of electrical energy",
    "Rusting of iron occurs when iron reacts with moisture and oxygen",
    "Pure water has a neutral pH value of seven",
    "Coal and petroleum are fossil fuels formed millions of years ago",
    "Renewable solar and wind energy do not produce smoke or pollution",

    # 38. Practical Commerce, Profit & Loss, Simple Interest & Budgeting
    "Profit is earned when the selling price is greater than the cost price",
    "Loss occurs when an article is sold for less than its purchasing price",
    "Calculate simple interest using principal, rate of interest and time",
    "A monthly household budget helps manage income and prevent unnecessary debt",
    "Kisan Credit Card provides easy credit to farmers for agricultural seeds and tools",
    "Fair price shops ensure affordable food grains for all eligible families",
    "Farmer Producer Organizations help farmers get the best price for crops",
    "Digital payments through QR codes make rural commerce easy and transparent",
    "Never borrow money from unauthorized moneylenders with exorbitant interest rates",
    "Saving ten percent of your earnings every month secures your children's future",

    # 39. Advanced Hindi Curricular & Civic Sentences
    "मानव मस्तिष्क शरीर के सभी अंगों और विचारों को नियंत्रित करता है।",
    "लाल रक्त कोशिकाएं फेफड़ों से पूरे शरीर में ऑक्सीजन पहुंचाती हैं।",
    "हड्डियों का ढांचा हमारे शरीर को आकार और मजबूती प्रदान करता है।",
    "सफेद रक्त कोशिकाएं बीमारियों और संक्रमण से शरीर की रक्षा करती हैं।",
    "पृथ्वी पर सात महाद्वीप और पांच बड़े महासागर हैं।",
    "एशिया विश्व का सबसे बड़ा महाद्वीप है जहां विभिन्न संस्कृतियां हैं।",
    "पिलचू हाड़ाम और पिलचू बूढ़ी संतालों के आदि पूर्वज माने जाते हैं।",
    "मासांग बुरु और जाहेर एरा हमारे समाज के परम पूज्य हैं।",
    "बानम और तिरियो संताली संगीत के मधुर और पारंपरिक वाद्य यंत्र हैं।",
    "तामाक और तुमदाक की थाप पर लोक नृत्य किया जाता है।",
    "लोहा, तांबा और एल्युमिनियम उपयोगी धातुएं हैं।",
    "लाभ तब होता है जब विक्रय मूल्य क्रय मूल्य से अधिक होता है।",
    "किसान क्रेडिट कार्ड से किसानों को कम ब्याज पर ऋण मिलता है।",
    "डिजिटल भुगतान से व्यापार करना सुरक्षित और सुविधाजनक हो गया है।",
    "प्रतिदिन व्यायाम करने से शरीर स्वस्थ और मन प्रसन्न रहता है।",
    "प्रकृति के साथ तालमेल बनाकर जीना ही सच्चा जीवन है।",

    # 40. Astronomy, Solar System, Planets & Space Science
    "The sun is a massive glowing star at the center of our solar system",
    "Mercury is the closest planet to the sun and has extreme temperatures",
    "Venus is known as the morning star and evening star in the night sky",
    "Mars is called the red planet because of iron oxide on its rocky surface",
    "Jupiter is the largest planet in our solar system with many orbiting moons",
    "Saturn is famous for its magnificent system of bright circular rings",
    "The Milky Way is the vast spiral galaxy that contains our solar system",
    "Artificial satellites orbit the Earth and transmit weather and television signals",
    "Indian space scientists launch rockets and satellites from Sriharikota",
    "Telescopes help astronomers observe distant stars, nebulas and galaxies",

    # 41. Botany, Plant Kingdom, Medicinal Herbs & Photosynthesis
    "Plant roots anchor the plant firmly in the soil and absorb water and minerals",
    "The stem carries water and nutrients from roots to leaves and branches",
    "Leaves are known as the food factories of green plants",
    "Flowers attract bees and butterflies for cross-pollination and seed production",
    "Neem leaves have natural antibacterial properties and purify the blood",
    "Tulsi leaves are revered for curing cold, cough and boosting immunity",
    "Amla or Indian gooseberry is rich in vitamin C and strengthens hair and skin",
    "Harida and Baheda fruits are traditional Ayurvedic remedies for digestion",
    "Seeds need moisture, air and warmth to germinate into healthy saplings",
    "Banyan and Peepal trees provide cool shade and produce abundant oxygen",

    # 42. Water Management, Watershed, Check Dams & River Conservation
    "Check dams built across village streams prevent soil erosion and conserve water",
    "Rooftop rainwater harvesting recharges underground groundwater tables",
    "Drip irrigation delivers water drop by drop directly to plant roots",
    "Sprinkler irrigation spreads water evenly over agricultural fields like rain",
    "Watershed management ensures sustainable water availability for farming",
    "Never dump factory waste or untreated sewage into flowing rivers",
    "Ponds and wetlands are natural reservoirs that support biodiversity",
    "Clean drinking water pipelines prevent typhoid, cholera and jaundice",
    "Conserving every drop of water secures the agricultural future of our villages",
    "Villagers should unite to desilt and maintain community water ponds",

    # 43. Indian Freedom Movement, Tribal Martyrs & National Leaders
    "Mahatma Gandhi led the non-violent struggle for Indian national independence",
    "Netaji Subhash Chandra Bose formed the Indian National Army for freedom",
    "Bhagat Singh sacrificed his life courageously for the liberation of the motherland",
    "Rani Lakshmibai of Jhansi fought heroically against foreign colonial rule",
    "Tilka Majhi took up arms against British oppression in the year seventeen eighty-four",
    "Sidhu and Kanhu declared the famous Santhal Hul rebellion in eighteen fifty-five",
    "Birsa Munda mobilized the tribal masses for Ulgulan and land rights",
    "Baba Tilka Majhi is remembered as the earliest martyr of tribal freedom struggles",
    "Tribal freedom fighters fought valiantly to protect their land, forest and dignity",
    "We honor the sacrifices of all freedom fighters who won our independence",

    # 44. Environmental Sustainability, Afforestation & Pollution Control
    "Planting indigenous trees creates lush green forests and prevents desertification",
    "Air pollution caused by vehicle exhaust and industrial smoke harms human lungs",
    "Noise pollution from loud speakers and traffic causes stress and hearing loss",
    "Organic farming preserves soil fertility without harmful synthetic chemicals",
    "Use cloth bags instead of single-use disposable plastic bags",
    "Segregating biodegradable kitchen waste produces rich organic compost",
    "Conserving electricity by turning off unused lights saves valuable energy",
    "Solar cookers and solar water heaters utilize free and clean solar energy",
    "Clean and green villages promote healthy living and longevity",
    "Protecting wildlife habitats ensures ecological harmony for future generations",

    # 45. Media, Telecommunication, Satellites & Information Networks
    "Newspapers provide daily news, editorial opinions and educational articles",
    "Radio broadcasts weather forecasts, agricultural tips and folk music",
    "Television broadcasts live educational lessons and scientific documentaries",
    "Fiber optic cables transmit internet data across oceans at the speed of light",
    "Smartphones combine telephony, photography, messaging and internet browsing",
    "Digital libraries give students access to thousands of books online",
    "Community radio stations broadcast local news in tribal mother tongues",
    "Online educational courses help rural youth acquire advanced technical skills",
    "Use the internet responsibly for knowledge, learning and constructive communication",
    "Digital technology bridges the gap between rural villages and modern cities",

    # 46. Extended Hindi Curricular, Scientific & Historical Sentences
    "सूर्य हमारे सौरमंडल के केंद्र में स्थित एक विशाल चमकता तारा है।",
    "बुध सूर्य का सबसे नजदीकी ग्रह है और बहुत गर्म है।",
    "मंगल ग्रह को लाल ग्रह कहा जाता है क्योंकि इसकी सतह लाल है।",
    "बृहस्पति हमारे सौरमंडल का सबसे बड़ा और विशालकाय ग्रह है।",
    "शनि ग्रह अपने सुंदर और चमकदार छल्लों के लिए जाना जाता है।",
    "नीम और तुलसी में अनेक औषधीय गुण होते हैं जो हमें स्वस्थ रखते हैं।",
    "आंवला विटामिन सी से भरपूर होता है और शरीर की रोग प्रतिरोधक क्षमता बढ़ाता है।",
    "वर्षा जल संचयन से भूजल स्तर में सुधार होता है।",
    "टपक सिंचाई पद्धति से पानी की बचत होती है और फसलों को पर्याप्त नमी मिलती है।",
    "महात्मा गांधी ने सत्य और अहिंसा के मार्ग पर चलकर देश को आजाद कराया।",
    "नेताजी सुभाष चंद्र बोस ने आजाद हिंद फौज का गठन किया था।",
    "शहीद भगत सिंह ने मातृभूमि की स्वतंत्रता के लिए अपने प्राण न्यौछावर कर दिए।",
    "तिलका मांझी ने अंग्रेजों के शोषण के खिलाफ पहला बिगुल फूंका था।",
    "सिद्धू-कान्हू ने ऐतिहासिक संताल हूल का नेतृत्व किया था।",
    "वृक्षारोपण करने से पर्यावरण शुद्ध रहता है और समय पर बारिश होती है।",
    "प्लास्टिक की थैलियों के स्थान पर कपड़े के थैलों का उपयोग करना चाहिए।",
    "सौर ऊर्जा प्रदूषण मुक्त और असीमित ऊर्जा का सबसे उत्तम स्रोत है।",
    "अखबार और रेडियो से हमें देश-दुनिया की महत्वपूर्ण जानकारियां मिलती हैं।",
    "स्मार्टफोन और इंटरनेट ने दूरियों को मिटाकर संचार को आसान बना दिया है।",
    "गांव की एकता और स्वच्छता ही हमारी असली पहचान और ताकत है।",

    # 47. Chemistry: Acids, Bases, Litmus & Everyday Reactions
    "Lemon juice tastes sour because it contains natural citric acid",
    "Baking soda is a mild base that neutralizes stomach acidity",
    "Blue litmus paper turns red when dipped in an acidic solution",
    "Red litmus paper turns blue when exposed to basic substances",
    "Soap and detergents dissolve grease and dirt in washing water",
    "Neutralization occurs when an acid reacts with a base to form salt and water",
    "Milk turns into sour curd through natural bacterial fermentation",
    "Rusting of iron requires both oxygen and water to occur",
    "Burning of firewood is a chemical change that produces heat, ash and smoke",
    "Photosynthesis converts carbon dioxide and water into glucose and oxygen",

    # 48. Physics: Energy Transformation, Gravity, Hydropower & Wind Energy
    "Energy can neither be created nor destroyed, only transformed from one form to another",
    "Potential energy stored in dam water converts into kinetic energy when falling",
    "Hydropower plants generate clean electricity using flowing river water",
    "Windmills convert kinetic wind energy into mechanical and electrical power",
    "Gravity is the invisible force that pulls all objects toward the center of the Earth",
    "Sir Isaac Newton discovered the universal law of gravitation",
    "Solar photovoltaic cells convert sunlight directly into electric current",
    "An electric circuit requires a closed complete loop for electric current to flow",
    "A simple lever makes lifting heavy stones and loads much easier",
    "Sound vibrations travel through air, water and solid materials",

    # 49. World Heritage, Ancient Civilizations & United Nations
    "The Indus Valley Civilization was famous for planned brick cities and drainage",
    "The United Nations works to maintain international peace and cooperation",
    "Human rights belong equally to all people without any discrimination",
    "Ancient people painted historical scenes on rock caves and stone shelters",
    "The Taj Mahal in Agra is a celebrated monument of world heritage",
    "Konark Sun Temple in Odisha is an architectural marvel carved in stone",
    "Cultural diversity enriches the global human community",
    "Libraries preserve centuries of human knowledge and philosophical wisdom",
    "Archaeologists discover ancient artifacts to understand past human history",
    "International Mother Language Day promotes linguistic diversity worldwide",

    # 50. Santali Social Rites of Passage, Customs & Traditions
    "Cacho Chhater is the sacred Santali initiation ceremony into full community membership",
    "Bapla is the traditional Santali wedding celebrated with joy, dancing and songs",
    "Bhandan is the solemn ancestral ceremony performed to honor departed souls",
    "Jom Sim is a revered ritual honoring ancient ancestral origins and village peace",
    "Sohrai harvest festival honors livestock and thanksgiving for bumper crops",
    "Baha parab celebrates the arrival of spring and blooming of new sal flowers",
    "The Majhi Than is the sacred memorial stone of the village founding ancestors",
    "Santhal customary laws emphasize consensus, justice, equality and community harmony",
    "Traditional Santali hospitality welcomes every stranger with honor and respect",
    "Maintaining our indigenous customs preserves our cultural sovereignty and dignity",

    # 51. Mental Wellbeing, Mindfulness, Empathy & Moral Strength
    "A peaceful calm mind helps us make wise decisions in difficult times",
    "Empathy means understanding and sharing the feelings of other people",
    "Daily meditation and deep breathing reduce anxiety and mental stress",
    "Gratitude for everyday blessings fills the heart with joy and contentment",
    "Forgiveness frees the mind from anger, bitterness and hatred",
    "Honesty in speech and action builds lasting trust among community members",
    "Patience and perseverance help students achieve excellence in education",
    "Kind words spoken with love can heal emotional pain and sorrow",
    "Self-confidence grows through regular practice, learning and humility",
    "Teamwork and mutual respect make any challenging goal achievable",

    # 52. Disaster Management: Cyclones, Heatwaves & First Response
    "Early cyclone warnings broadcast on radio help coastal villagers evacuate safely",
    "Drink plenty of water and avoid direct afternoon sun during severe summer heatwaves",
    "Move to cyclone shelter buildings with essential food, water and medicines",
    "Do not stand under tall trees or electric poles during heavy lightning storms",
    "Keep emergency phone numbers of police, hospital and disaster relief accessible",
    "Flooded roads must never be crossed on foot or by vehicle",
    "Stock dry food, clean drinking water and candles before severe cyclonic storms",
    "Community youth volunteers play a vital role during disaster rescue operations",
    "Planting mangrove forests along coastlines protects villages from tidal waves",
    "Disaster preparedness training saves precious human and animal lives",

    # 53. Extended Hindi Curricular, Chemistry, Culture & Ethics Sentences
    "नींबू का रस खट्टा होता है क्योंकि इसमें प्राकृतिक साइट्रिक अम्ल होता है।",
    "बेकिंग सोडा एक हल्का क्षार है जो पेट की अम्लता को शांत करता है।",
    "नीला लिटमस पेपर अम्ल में डालने पर लाल रंग में बदल जाता है।",
    "ऊर्जा को न तो बनाया जा सकता है और न ही नष्ट किया जा सकता है।",
    "गुरुत्वाकर्षण बल पृथ्वी की सभी वस्तुओं को अपनी ओर खींचता है।",
    "पवन चक्कियां हवा की गति से स्वच्छ बिजली बनाती हैं।",
    "सिंधु घाटी सभ्यता अपनी सुनियोजित नगर योजना के लिए प्रसिद्ध थी।",
    "कोणार्क का सूर्य मंदिर ओडिशा की अद्वितीय वास्तुकला का प्रतीक है।",
    "चाचो छटियार संताली समाज में सामाजिक मान्यता का प्रमुख संस्कार है।",
    "सोहराय और बाहा हमारे समाज के सबसे पवित्र और आनंददायक पर्व हैं।",
    "सहानुभूति और दयाभाव से ही समाज में सच्चा प्रेम और सद्भाव बढ़ता है।",
    "प्रातःकाल ध्यान और योगाभ्यास करने से मानसिक शांति प्राप्त होती है।",
    "चक्रवात की चेतावनी मिलने पर तुरंत सुरक्षित पक्के भवनों में शरण लें।",
    "तटीय क्षेत्रों में मैंग्रोव के जंगल समुद्री तूफानों से रक्षा करते हैं।",
    "सदा सत्य बोलो, दूसरों की सहायता करो और समय का सम्मान करो।",
    "ज्ञान और विनम्रता ही एक आदर्श मनुष्य के सबसे सुंदर आभूषण हैं।",

    # 54. Advanced Agricultural Science: Soil Nutrients (NPK), Vermicompost & Biofertilizers
    "Nitrogen promotes healthy green leaf and stem growth in crops",
    "Phosphorus strengthens plant roots and aids in flowering and seed formation",
    "Potassium helps plants resist diseases and regulates water uptake",
    "Vermicompost made using earthworms is rich in beneficial micro-organisms",
    "Green manuring involves ploughing leguminous plants back into the soil",
    "Bio-fertilizers fix atmospheric nitrogen naturally into the agricultural soil",
    "Soil testing laboratories analyze soil pH and nutrient levels for free",
    "Crop rotation with pulses restores depleted nitrogen back to the field",
    "Drip irrigation prevents weed growth and minimizes water evaporation",
    "Organic farming protects underground water from chemical nitrate pollution",

    # 55. Vitamins, Essential Minerals & Human Nutrition
    "Vitamin A found in carrots and green leafy vegetables prevents night blindness",
    "Vitamin B complex maintains healthy nerves, brain function and energy metabolism",
    "Vitamin C present in citrus fruits and amla protects against scurvy and infections",
    "Vitamin D is synthesized naturally in human skin upon exposure to morning sunlight",
    "Iron is essential for the production of hemoglobin and prevention of anemia",
    "Calcium and phosphorus build dense, strong bones and healthy teeth",
    "Iodine in iodized salt is necessary for the proper functioning of thyroid gland",
    "Protein-rich pulses, eggs and milk repair damaged tissues and build muscle mass",
    "Dietary fiber from whole grains and vegetables ensures healthy digestion",
    "Drinking clean boiled water every day prevents waterborne stomach infections",

    # 56. Geology, Mineral Wealth of Mayurbhanj, Odisha & Jharkhand
    "Mayurbhanj is rich in high-grade iron ore deposits at Gorumahisani and Badampahar",
    "Bauxite ore is refined into valuable lightweight aluminium metal",
    "Chromite and manganese are crucial minerals used in making stainless steel",
    "Coal deposits in Jharkhand provide fuel for thermal power stations",
    "Limestone is the primary raw material used in manufacturing construction cement",
    "Geologists explore mineral veins deep beneath the Earth's crust",
    "Responsible eco-friendly mining preserves forest cover and water sources",
    "Quartzite and granite rocks are used as strong building stones",
    "Mica is a non-conductive mineral widely used in electrical appliances",
    "Our tribal land is blessed with abundant natural resources and biodiversity",

    # 57. Traditional Ethnobotany & Tribal Medicinal Knowledge
    "Kalmegh leaves are a potent traditional remedy for liver ailments and fever",
    "Chirata extract is traditionally used to treat malarial fevers and purify blood",
    "Brahmi leaves enhance memory, concentration and cognitive clarity in students",
    "Ashwagandha root boosts physical stamina, vitality and relieves fatigue",
    "Turmeric paste with mustard oil heals wounds and reduces muscular swelling",
    "Ginger and black pepper tea relieves sore throat, cough and chest congestion",
    "Tribal medicine practitioners or Kaviraj have passed down botanical wisdom for generations",
    "Medicinal plants must be harvested sustainably without uprooting whole herbs",
    "Village herbal gardens protect rare healing plants for community healthcare",
    "Traditional herbal knowledge forms the foundation of modern pharmacology",

    # 58. Democratic Institutions, Courts, Elections & RTI
    "The Supreme Court of India is the highest judicial authority in the nation",
    "The President of India is the constitutional head of the Republic",
    "The Prime Minister leads the Union Council of Ministers in governance",
    "The Election Commission conducts free, fair and impartial democratic elections",
    "Citizens use Electronic Voting Machines to cast their confidential vote",
    "Right to Information Act empowers citizens to seek transparency from government offices",
    "High Courts protect fundamental constitutional rights within individual states",
    "Independent judiciary ensures justice, equality and rule of law for all",
    "Citizens have the democratic duty to participate actively in voter registration",
    "Panchayati Raj decentralizes political power down to village grassroots",

    # 59. Modern Logistics, Clean Electric Vehicles & High-Speed Transport
    "Electric vehicles run on rechargeable lithium batteries and produce zero tailpipe emissions",
    "Metro rail networks provide fast, pollution-free transport in crowded cities",
    "Container ships transport agricultural grains and industrial goods across global oceans",
    "High-speed trains connect distant regional centers in a few short hours",
    "Air cargo delivers urgent medicines and emergency supplies worldwide overnight",
    "Bicycle tracks encourage healthy, eco-friendly and active local commuting",
    "Solar charging stations provide green renewable power for electric two-wheelers",
    "Modern bridges over broad rivers reduce travel time between tribal villages and district towns",
    "Paved all-weather rural roads boost village trade and emergency ambulance access",
    "Efficient public transportation reduces traffic congestion and carbon footprints",

    # 60. Statistics, Data Interpretation, Probability & Graphing
    "A bar graph represents comparative data using vertical or horizontal rectangular bars",
    "A pie chart divides a circle into sectors to display proportional percentages",
    "The arithmetic mean is calculated by dividing the sum of values by total count",
    "The median is the middle value when data points are arranged in ascending order",
    "The mode is the most frequently occurring value in a data distribution",
    "Probability measures the numerical likelihood of an event occurring",
    "Line graphs track temperature and rainfall trends over twelve months of the year",
    "Tables organize complex mathematical information clearly into rows and columns",
    "Data analysis helps farmers predict rainfall patterns and crop yields accurately",
    "Understanding basic statistics helps citizens interpret news and scientific reports",

    # 61. Extended Hindi Curricular Sentences
    "नाइट्रोजन से पौधों की पत्तियां हरी-भरी और तने मजबूत होते हैं।",
    "केंचुआ खाद यानी वर्मीकम्पोस्ट मिट्टी की उर्वरता को कई गुना बढ़ा देती है।",
    "विटामिन ए आंखों की रोशनी के लिए और विटामिन सी रोग प्रतिरोधक क्षमता के लिए आवश्यक है।",
    "आयोडीन युक्त नमक घेंघा रोग से बचाव करता है।",
    "मयूरभंज की बादामपहाड़ खदानें उच्च कोटि के लौह अयस्क के लिए प्रसिद्ध हैं।",
    "कालमेघ और चिरायता का काढ़ा बुखार और यकृत रोगों में लाभकारी है।",
    "हल्दी और सरसों का तेल घाव भरने में प्राकृतिक औषधि का काम करता है।",
    "भारत का सर्वोच्च न्यायालय देश का शीर्ष न्यायिक संस्थान है।",
    "चुनाव आयोग स्वतंत्र और निष्पक्ष चुनाव संपन्न कराता है।",
    "सूचना का अधिकार अधिनियम नागरिकों को सरकारी कार्यों में पारदर्शिता प्रदान करता है।",
    "इलेक्ट्रिक वाहन प्रदूषण मुक्त होते हैं और पर्यावरण की रक्षा करते हैं।",
    "दंड आरेख यानी बार ग्राफ से आंकड़ों की तुलना करना बहुत आसान हो जाता है।",
    "प्रतिदिन पौष्टिक आहार और स्वच्छ जल ही दीर्घायु का मूल मंत्र है।",
    "स्वच्छता, साक्षरता और स्वावलंबन से ही हर गांव का चहुंमुखी विकास संभव है।",

    # 62. Classical Physics & Modern Mechanics
    "Work is done when a force applied on an object produces movement in its direction",
    "Power is the rate at which work is done or energy is transferred",
    "Pressure is defined as the force acting perpendicular to a unit surface area",
    "Hydraulic brakes in modern vehicles operate on Pascal's principle of liquid pressure",
    "Friction opposes motion between two surfaces in contact and produces warmth",
    "Lubricating moving machine parts with oil reduces mechanical wear and tear",
    "Streamlined shapes of birds and airplanes reduce air resistance during high-speed flight",
    "A pendulum swings back and forth with a regular periodic time interval",
    "Centripetal force keeps a moving body in a circular curved path",
    "Simple machines like pulleys and inclined planes make heavy lifting effortless",

    # 63. Atmospheric Sciences & Weather Instruments
    "A barometer measures atmospheric air pressure and forecasts storms",
    "An anemometer measures wind speed and direction in weather observation stations",
    "A rain gauge accurately measures the amount of rainfall received in millimeters",
    "A hygrometer measures the percentage of moisture and humidity in the air",
    "A clinical thermometer measures human body temperature accurately in Celsius or Fahrenheit",
    "Atmospheric pressure decreases as altitude increases in high mountain ranges",
    "Warm air rises upward creating low pressure zones that draw in sea breezes",
    "Cumulonimbus clouds are tall towering clouds that bring torrential rain and lightning",
    "Weather satellites photograph cyclone movements across oceans from space",
    "Daily weather forecasts help farmers plan sowing, irrigation and harvesting schedules",

    # 64. Public Health, Sanitation & Preventive Medicine
    "Regular handwashing with soap kills dangerous disease-causing microbes",
    "Proper sanitation and fly-proof toilets eliminate the spread of diarrheal infections",
    "Immunization protects infants from polio, measles, tetanus and hepatitis",
    "Food should always be kept covered to protect it from houseflies and dust",
    "Boiling drinking water for ten minutes destroys all pathogenic bacteria and cysts",
    "Nutritious mid-day meals in primary schools eliminate child malnutrition",
    "Iron tablets distributed by health workers prevent anemia among school girls",
    "Clean community drains prevent stagnant water where disease-carrying mosquitoes breed",
    "Maintaining personal hygiene boosts self-esteem, vigor and overall wellness",
    "Physical activity, outdoor games and clean air strengthen the immune system",

    # 65. Forestry, Flora & Wild Fauna of Simlipal Biosphere
    "Simlipal Biosphere Reserve is a biodiversity haven in Mayurbhanj district",
    "Majestic wild Asian elephants roam freely through the sal and bamboo forests",
    "The Royal Bengal Tiger is the apex predator that maintains the forest ecosystem balance",
    "Barehipani and Joranda are breathtaking waterfalls cascading down rocky cliffs in Simlipal",
    "The Indian Giant Squirrel leaps gracefully among the high forest tree canopies",
    "Rare medicinal orchids and wild ferns flourish along cool forest streams",
    "Tribal forest protection committees safeguard forests against illegal timber poachers",
    "Non-timber forest produce like Sal leaves and Mahua provide sustainable tribal livelihoods",
    "Forest corridors allow safe seasonal migration for elephant herds",
    "Conserving the pristine wilderness of Simlipal preserves our ancient natural heritage",

    # 66. Constitutional Rights & Gender Equality
    "Gender equality means equal rights, opportunities and dignity for women and men",
    "Educating girls empowers families, communities and the entire nation",
    "The Constitution guarantees equal pay for equal work to all citizens",
    "Women leaders in Gram Panchayats bring positive transformation to village life",
    "Every child has the fundamental right to be protected against forced labor",
    "Self Help Groups foster financial independence and entrepreneurial skills among rural women",
    "Strict laws protect women from domestic violence and workplace harassment",
    "Respecting and honoring women is an essential foundation of an enlightened society",
    "Skill training centers enable youth of all backgrounds to secure dignified livelihoods",
    "Social justice ensures that the weakest members of society receive protection and support",

    # 67. Digital Security & Cyber Safety
    "Always create strong passwords containing letters, numbers and special characters",
    "Never share banking OTPs, PIN numbers or passwords with strangers on phone calls",
    "Two-factor authentication adds an essential second layer of account security",
    "Beware of fraudulent links and fake messages offering lottery prizes or instant loans",
    "Verify the authenticity of websites before entering any personal or financial information",
    "Log out of public computer terminals after completing your work",
    "Keep device operating systems and security software updated regularly",
    "Do not download unknown email attachments from untrusted senders",
    "Cyber safety awareness protects citizens from digital scams and identity theft",
    "Use social media platforms constructively for knowledge, collaboration and positive causes",

    # 68. Extended Hindi Curricular Sentences
    "कार्य तब होता है जब किसी वस्तु पर बल लगाने से उसमें विस्थापन होता है।",
    "दाब वह बल है जो किसी सतह के एकांक क्षेत्रफल पर लंबवत कार्य करता है।",
    "बैरोमीटर से वायुमंडलीय दबाव और वर्षामापी से वर्षा की मात्रा नापी जाती है।",
    "साबुन से हाथ धोना और साफ पानी पीना अनेक बीमारियों से बचाता है।",
    "सिमलीपाल बायोस्फीयर रिजर्व मयूरभंज की अनमोल प्राकृतिक धरोहर है।",
    "बारेहीपानी और जोरांदा जलप्रपात अपनी प्राकृतिक सुंदरता के लिए प्रसिद्ध हैं।",
    "महिला शिक्षा और लैंगिक समानता समाज की उन्नति के लिए अत्यंत आवश्यक है।",
    "संविधान सभी नागरिकों को समान अवसर और न्याय का अधिकार देता है।",
    "अपना बैंक पासवर्ड या ओटीपी किसी के साथ साझा कभी न करें।",
    "मजबूत पासवर्ड और दो-चरणीय प्रमाणीकरण यानी 2FA से डिजिटल खाते सुरक्षित रहते हैं।",
    "सहानुभूति, सहयोग और अनुशासन ही जीवन को सार्थक और सफल बनाते हैं।",
    "प्रकृति और पर्यावरण की रक्षा करना हम सभी का पावन कर्तव्य है।"
]


def fetch_neural_translation(text, memory=None):
    """Query neural translation API with memory cache check, dual API fallback and retry."""
    clean_txt = text.strip()
    if not clean_txt:
        return None

    sl = "hi" if any(ord(c) > 255 for c in clean_txt) else "en"
    src_key = "hin_Deva" if sl == "hi" else "eng_Latn"
    norm_s = clean_txt.lower().rstrip(".,!?|।")

    # Fast reuse if already in memory
    if memory and src_key in memory:
        if "sat_Olck" in memory[src_key] and norm_s in memory[src_key]["sat_Olck"]:
            return (clean_txt, memory[src_key]["sat_Olck"][norm_s], sl)

    # Primary API: GTX Neural
    for attempt in range(3):
        try:
            url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl=sat&dt=t&q={urllib.parse.quote(clean_txt)}"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=8.0) as res:
                if res.status == 200:
                    raw = json.loads(res.read().decode("utf-8"))
                    if raw and isinstance(raw, list) and raw[0]:
                        parts = [seg[0] for seg in raw[0] if seg and seg[0]]
                        out = "".join(parts).strip()
                        if out and out.lower() != clean_txt.lower():
                            return (clean_txt, out, sl)
        except Exception:
            time.sleep(0.4 * (attempt + 1))

    # Secondary API: MyMemory
    try:
        pair = f"{sl}|sat"
        url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(clean_txt)}&langpair={pair}"
        req = urllib.request.Request(url, headers={"User-Agent": "PALASH-Setu/1.0"})
        with urllib.request.urlopen(req, timeout=6.0) as res:
            if res.status == 200:
                raw_json = json.loads(res.read().decode("utf-8"))
                out_text = raw_json.get("responseData", {}).get("translatedText", "").strip()
                if out_text and out_text.lower() != clean_txt.lower() and not out_text.startswith("MYMEMORY WARNING"):
                    return (clean_txt, out_text, sl)
    except Exception:
        pass

    return None


def run_training_pipeline():
    print("\n" + "=" * 75)
    print("  🚀 SurSetu - Large-Scale API Training & Corpus Expansion (Resilient)")
    print("=" * 75 + "\n")
    print(f"Target Prompts: {len(TRAINING_PROMPTS)} sentences across all core curricula.")
    print("Fetching high-fidelity neural Santali translations with multi-script transduction...\n")

    # Load existing memory
    memory = {"hin_Deva": {"sat_Olck": {}, "sat_Orya": {}}, "eng_Latn": {"sat_Olck": {}, "sat_Orya": {}}}
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                memory = json.load(f)
        except Exception:
            pass

    successful_count = 0

    # Multi-threaded fetching with 6 workers and memory reuse
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        future_to_prompt = {executor.submit(fetch_neural_translation, prompt, memory): prompt for prompt in TRAINING_PROMPTS}
        
        for idx, future in enumerate(concurrent.futures.as_completed(future_to_prompt), start=1):
            prompt = future_to_prompt[future]
            try:
                result = future.result()
                if result:
                    src_text, ol_text, sl = result
                    src_key = "hin_Deva" if sl == "hi" else "eng_Latn"
                    norm_s = src_text.lower().rstrip(".,!?|।")

                    # Generate Odia script transliteration
                    odia_text = transduce_script(ol_text, "ol_chiki", "odia")

                    # Index in memory
                    if src_key not in memory:
                        memory[src_key] = {"sat_Olck": {}, "sat_Orya": {}}
                    if "sat_Olck" not in memory[src_key]:
                        memory[src_key]["sat_Olck"] = {}
                    if "sat_Orya" not in memory[src_key]:
                        memory[src_key]["sat_Orya"] = {}

                    memory[src_key]["sat_Olck"][src_text] = ol_text
                    memory[src_key]["sat_Olck"][norm_s] = ol_text
                    memory[src_key]["sat_Orya"][src_text] = odia_text
                    memory[src_key]["sat_Orya"][norm_s] = odia_text

                    successful_count += 1
                    print(f"  [{idx:03d}/{len(TRAINING_PROMPTS)}] ✓ '{src_text[:35]}...' ➔ '{ol_text[:35]}...'")
                else:
                    print(f"  [{idx:03d}/{len(TRAINING_PROMPTS)}] ⚠️ Skipped '{prompt[:35]}...'")
            except Exception as exc:
                print(f"  [{idx:03d}/{len(TRAINING_PROMPTS)}] ❌ Error: {exc}")

    # Save memory to disk
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 75)
    print(f"  ✨ Training Complete: Successfully harvested & indexed {successful_count} sentences!")
    print(f"  💾 Persisted to: '{MEMORY_FILE}'")
    total_eng = len(memory.get("eng_Latn", {}).get("sat_Olck", {}))
    total_hin = len(memory.get("hin_Deva", {}).get("sat_Olck", {}))
    print(f"  📊 Total In-Memory Corpus: {total_eng} English pairs, {total_hin} Hindi pairs")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    run_training_pipeline()
