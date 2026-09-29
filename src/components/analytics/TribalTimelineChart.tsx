import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SessionDataPoint, StudentLearningProfile } from '../../types';

interface TribalTimelineChartProps {
  student: StudentLearningProfile;
  width?: number;
  height?: number;
}

export const TribalTimelineChart: React.FC<TribalTimelineChartProps> = ({
  student,
  width = 560,
  height = 360,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeSession, setActiveSession] = useState<SessionDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !student.learningHistory || student.learningHistory.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 25, right: 45, bottom: 40, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const data = student.learningHistory;

    // Definitions (Gradients & Filters)
    const defs = svg.append('defs');

    // Gradient for score area
    const scoreGrad = defs
      .append('linearGradient')
      .attr('id', `scoreGrad-${student.id}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    scoreGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.45);
    scoreGrad.append('stop').attr('offset', '100%').attr('stop-color', '#064e3b').attr('stop-opacity', 0.0);

    // X Scale (Sessions)
    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => `S${d.sessionNumber} (${d.date})`))
      .range([0, innerWidth])
      .padding(0.3);

    // Left Y Scale (Score)
    const maxScore = d3.max(data, (d) => d.cumulativeScore) || 500;
    const yScaleScore = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxScore * 1.15)])
      .range([innerHeight, 0])
      .nice();

    // Right Y Scale (Accuracy 0-100%)
    const yScaleAccuracy = d3
      .scaleLinear()
      .domain([40, 100])
      .range([innerHeight, 0]);

    // Gridlines
    const yGrid = d3.axisLeft(yScaleScore).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-dasharray', '2 2');

    // Area generator for Score
    const areaGenerator = d3
      .area<SessionDataPoint>()
      .x((d) => xScale(`S${d.sessionNumber} (${d.date})`)!)
      .y0(innerHeight)
      .y1((d) => yScaleScore(d.cumulativeScore))
      .curve(d3.curveMonotoneX);

    // Line generator for Score
    const lineGeneratorScore = d3
      .line<SessionDataPoint>()
      .x((d) => xScale(`S${d.sessionNumber} (${d.date})`)!)
      .y((d) => yScaleScore(d.cumulativeScore))
      .curve(d3.curveMonotoneX);

    // Line generator for Accuracy %
    const lineGeneratorAccuracy = d3
      .line<SessionDataPoint>()
      .x((d) => xScale(`S${d.sessionNumber} (${d.date})`)!)
      .y((d) => yScaleAccuracy(d.accuracyRate))
      .curve(d3.curveMonotoneX);

    // Draw Score Area
    g.append('path')
      .datum(data)
      .attr('fill', `url(#scoreGrad-${student.id})`)
      .attr('d', areaGenerator);

    // Draw Score Curve
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.8)
      .attr('d', lineGeneratorScore);

    // Draw Accuracy Curve
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 4')
      .attr('d', lineGeneratorAccuracy);

    // Bottom Axis (Sessions / Dates)
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('transform', 'rotate(-15)')
      .style('text-anchor', 'end');

    // Left Y Axis (Score)
    const yAxisScore = d3.axisLeft(yScaleScore).ticks(5);
    g.append('g')
      .call(yAxisScore)
      .selectAll('text')
      .attr('fill', '#10b981')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Right Y Axis (Accuracy %)
    const yAxisAccuracy = d3.axisRight(yScaleAccuracy).ticks(5).tickFormat((d) => `${d}%`);
    g.append('g')
      .attr('transform', `translate(${innerWidth}, 0)`)
      .call(yAxisAccuracy)
      .selectAll('text')
      .attr('fill', '#f59e0b')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Interactive Vertical Guideline & Session Dots
    const focusLine = g
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 3')
      .style('opacity', 0);

    // Render Data Points on Curves
    data.forEach((d) => {
      const cx = xScale(`S${d.sessionNumber} (${d.date})`)!;
      const cyScore = yScaleScore(d.cumulativeScore);
      const cyAcc = yScaleAccuracy(d.accuracyRate);

      // Normal session score dot
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cyScore)
        .attr('r', d.milestoneUnlocked ? 7 : 4.5)
        .attr('fill', d.milestoneUnlocked ? '#fbbf24' : '#10b981')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.8)
        .style('cursor', 'pointer');

      // Accuracy marker dot
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cyAcc)
        .attr('r', 3.5)
        .attr('fill', '#f59e0b')
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 1.2);

      // Milestone Pin (if badge was unlocked at this session)
      if (d.milestoneUnlocked) {
        // Outer glowing pulse ring
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cyScore - 18)
          .attr('r', 12)
          .attr('fill', '#451a03')
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2);

        // Milestone Ol Chiki glyph inside pin
        g.append('text')
          .attr('x', cx)
          .attr('y', cyScore - 14)
          .attr('text-anchor', 'middle')
          .attr('font-family', "'Noto Sans Ol Chiki', sans-serif")
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('fill', '#fef08a')
          .text(d.milestoneGlyph || '🏆');

        // Connecting pin needle
        g.append('line')
          .attr('x1', cx)
          .attr('y1', cyScore - 6)
          .attr('x2', cx)
          .attr('y2', cyScore)
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 1.5);
      }
    });

    // Transparent overlay for smooth mouse tracking
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        // Find closest point
        let closest = data[0];
        let minDiff = Infinity;
        data.forEach((d) => {
          const cx = xScale(`S${d.sessionNumber} (${d.date})`)!;
          const diff = Math.abs(cx - mx);
          if (diff < minDiff) {
            minDiff = diff;
            closest = d;
          }
        });

        const closestX = xScale(`S${closest.sessionNumber} (${closest.date})`)!;
        focusLine
          .attr('x1', closestX)
          .attr('x2', closestX)
          .style('opacity', 1);

        setActiveSession(closest);

        const [svgX, svgY] = d3.pointer(event, svgRef.current);
        setTooltipPos({ x: svgX, y: svgY });
      })
      .on('mouseleave', function () {
        focusLine.style('opacity', 0);
        setActiveSession(null);
        setTooltipPos(null);
      });
  }, [student, width, height]);

  return (
    <div className="relative flex flex-col bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Learning Velocity & Milestone Trajectory</span>
          </div>
          <p className="text-[11px] text-slate-400">
            D3 dual-axis trajectory mapping cumulative score velocity alongside accuracy trends.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] shrink-0 font-mono">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Score (XP)</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-1 bg-amber-400 inline-block"></span>
            <span>Accuracy %</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-300">
            <span className="w-2 h-2 rounded-full bg-yellow-400 border border-white"></span>
            <span>Milestone Pin</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative overflow-x-auto">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        />

        {/* Dynamic Hover Tooltip */}
        {activeSession && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 border border-amber-500/50 rounded-2xl p-3 shadow-2xl text-xs text-white min-w-[210px] backdrop-blur-md transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: Math.max(110, Math.min(width - 110, tooltipPos.x)),
              top: Math.max(10, tooltipPos.y - 15),
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-bold text-amber-300">
                Session {activeSession.sessionNumber} ({activeSession.date})
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeSession.mode.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Total Score:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {activeSession.cumulativeScore} XP
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Accuracy:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {activeSession.accuracyRate}%
                </span>
              </div>
            </div>

            <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Peak Streak:</span>
              <span className="text-orange-400 font-bold">{activeSession.streak}x 🔥</span>
            </div>

            {/* Milestone Unlock Announcement */}
            {activeSession.milestoneUnlocked && (
              <div className="mt-2 p-1.5 rounded-lg bg-amber-950/80 border border-amber-400/60 text-amber-200 text-[11px] flex items-center gap-1.5">
                <span className="font-olchiki text-sm font-bold text-yellow-300">
                  {activeSession.milestoneGlyph}
                </span>
                <div>
                  <div className="text-[9px] uppercase font-bold text-amber-400">Milestone Pin</div>
                  <div className="font-bold text-white">{activeSession.milestoneUnlocked}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
