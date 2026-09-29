import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { StudentLearningProfile } from '../../types';

interface TribalRadarChartProps {
  student: StudentLearningProfile;
  width?: number;
  height?: number;
}

export const TribalRadarChart: React.FC<TribalRadarChartProps> = ({
  student,
  width = 380,
  height = 360,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<{
    label: string;
    olchiki: string;
    score: number;
    desc: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = 45;
    const radius = Math.min(width, height) / 2 - margin;
    const center = { x: width / 2, y: height / 2 };

    const competencies = [
      { key: 'visualRecognition', label: 'Visual Archery', olchiki: 'ᱛᱩᱧ (Visual)', score: student.competencyScores.visualRecognition, desc: 'Ol Chiki target recognition speed' },
      { key: 'auditoryDecoding', label: 'Mandar Drum Ear', olchiki: 'ᱨᱩ (Audio)', score: student.competencyScores.auditoryDecoding, desc: 'Phonological listening decoding' },
      { key: 'orthographicAssembly', label: 'Ol Chiki Jumble', olchiki: 'ᱚᱞ (Spelling)', score: student.competencyScores.orthographicAssembly, desc: 'Character sequence synthesis' },
      { key: 'accuracyRate', label: 'Accuracy & Precision', olchiki: 'ᱥᱟᱹᱨᱤ (Accuracy)', score: student.competencyScores.accuracyRate, desc: 'First-try answer correctness' },
      { key: 'streakEndurance', label: 'Streak Endurance', olchiki: 'ᱫᱟᱲᱮ (Streak)', score: student.competencyScores.streakEndurance, desc: 'Unbroken concentration span' },
      { key: 'lexiconBreadth', label: 'Lexicon Breadth', olchiki: 'ᱟᱹᱲᱟᱹ (Vocab)', score: student.competencyScores.lexiconBreadth, desc: 'Vocabulary variety covered' },
    ];

    const totalAxes = competencies.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Radius scale
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Root Group
    const g = svg
      .append('g')
      .attr('transform', `translate(${center.x}, ${center.y})`);

    // Definitions (Gradients & Glow filters)
    const defs = svg.append('defs');

    // Radial gradient for radar fill
    const radialGrad = defs
      .append('radialGradient')
      .attr('id', `radarGrad-${student.id}`)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    radialGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.6);
    radialGrad.append('stop').attr('offset', '70%').attr('stop-color', '#059669').attr('stop-opacity', 0.4);
    radialGrad.append('stop').attr('offset', '100%').attr('stop-color', '#047857').attr('stop-opacity', 0.15);

    // Glow filter
    const filter = defs.append('filter').attr('id', 'radarGlow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Draw Concentric Tribal Polygons (20%, 40%, 60%, 80%, 100%)
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      const levelPoints: [number, number][] = [];

      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleSlice - Math.PI / 2;
        levelPoints.push([
          levelRadius * Math.cos(angle),
          levelRadius * Math.sin(angle),
        ]);
      }

      // Draw background polygon line
      const polygonLine = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveLinearClosed);

      g.append('path')
        .datum(levelPoints)
        .attr('d', polygonLine)
        .attr('fill', level % 2 === 0 ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.2)')
        .attr('stroke', '#334155')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', level === levels ? 'none' : '3 3')
        .attr('opacity', 0.85);

      // Add level percentage text
      g.append('text')
        .attr('x', 4)
        .attr('y', -levelRadius)
        .attr('fill', '#64748b')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`${level * 20}%`);
    }

    // Draw Axis lines & Labels
    const axis = g.selectAll('.axis').data(competencies).enter().append('g').attr('class', 'axis');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_, i) => rScale(100) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('y2', (_, i) => rScale(100) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr('stroke', '#475569')
      .attr('stroke-width', 1.2)
      .attr('opacity', 0.6);

    // Axis Labels with Ol Chiki glyphs
    axis
      .append('text')
      .attr('x', (_, i) => (rScale(100) + 16) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('y', (_, i) => (rScale(100) + 16) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr('text-anchor', (_, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        if (Math.abs(Math.cos(angle)) < 0.1) return 'middle';
        return Math.cos(angle) > 0 ? 'start' : 'end';
      })
      .attr('dominant-baseline', 'central')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text((d) => d.label);

    axis
      .append('text')
      .attr('x', (_, i) => (rScale(100) + 16) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('y', (_, i) => (rScale(100) + 28) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr('text-anchor', (_, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        if (Math.abs(Math.cos(angle)) < 0.1) return 'middle';
        return Math.cos(angle) > 0 ? 'start' : 'end';
      })
      .attr('dominant-baseline', 'central')
      .attr('fill', '#10b981')
      .attr('font-size', '9px')
      .attr('font-family', "'Noto Sans Ol Chiki', sans-serif")
      .text((d) => d.olchiki);

    // Compute Student Radar Polygon Points
    const studentPoints: [number, number][] = competencies.map((c, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return [rScale(c.score) * Math.cos(angle), rScale(c.score) * Math.sin(angle)];
    });

    const radarLine = d3
      .line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveLinearClosed);

    // Animate the radar polygon
    g.append('path')
      .datum(studentPoints)
      .attr('d', radarLine)
      .attr('fill', `url(#radarGrad-${student.id})`)
      .attr('stroke', '#34d399')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#radarGlow)')
      .attr('opacity', 0.9);

    // Draw vertex dots with interactive hover events
    g.selectAll('.radar-point')
      .data(competencies)
      .enter()
      .append('circle')
      .attr('class', 'radar-point')
      .attr('cx', (d, i) => rScale(d.score) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.score) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr('r', 5)
      .attr('fill', '#f59e0b')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(150).attr('r', 8).attr('fill', '#ec4899');
        const [mx, my] = d3.pointer(event, svgRef.current);
        setHoveredMetric({
          label: d.label,
          olchiki: d.olchiki,
          score: d.score,
          desc: d.desc,
          x: mx,
          y: my,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('r', 5).attr('fill', '#f59e0b');
        setHoveredMetric(null);
      });
  }, [student, width, height]);

  return (
    <div className="relative flex flex-col items-center bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between w-full mb-1">
        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>FLN Competency Radar (ᱥᱟᱹᱨᱫᱤ ᱨᱟᱰᱟᱨ)</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          D3.js Vector Graph
        </span>
      </div>

      <p className="text-[11px] text-slate-400 self-start mb-2">
        Evaluates 6 foundational multilingual competencies across cognitive learning modes.
      </p>

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        />

        {/* Dynamic D3 Tooltip */}
        {hoveredMetric && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900/95 border border-emerald-500/50 rounded-xl p-2.5 shadow-2xl text-xs text-white max-w-[200px] backdrop-blur-md transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: hoveredMetric.x,
              top: hoveredMetric.y - 12,
            }}
          >
            <div className="font-bold text-amber-300 flex items-center justify-between gap-2">
              <span>{hoveredMetric.label}</span>
              <span className="font-mono text-emerald-400 font-extrabold">{hoveredMetric.score}%</span>
            </div>
            <div className="font-olchiki text-emerald-300 text-[11px] pt-0.5">
              {hoveredMetric.olchiki}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 leading-snug">
              {hoveredMetric.desc}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
