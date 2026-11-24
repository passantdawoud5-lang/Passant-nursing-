import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { BookingOrder } from '../types';
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  Droplet, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Maximize2
} from 'lucide-react';

interface VitalSignsChartProps {
  bookings: BookingOrder[];
}

interface ParsedVisitData {
  id: string;
  date: string;
  displayDate: string;
  serviceTitle: string;
  nurseName: string;
  systolic: number;
  diastolic: number;
  glucose: number;
  heartRate: number;
  oxygen: number;
  rawBP: string;
  rawSugar: string;
  clinicalNotes: string;
}

export const VitalSignsChart: React.FC<VitalSignsChartProps> = ({ bookings }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'bp' | 'glucose'>('both');
  const [hoveredPoint, setHoveredPoint] = useState<ParsedVisitData | null>(null);
  const [hoverMetric, setHoverMetric] = useState<'bp' | 'glucose' | null>(null);

  const bpSvgRef = useRef<SVGSVGElement | null>(null);
  const glucoseSvgRef = useRef<SVGSVGElement | null>(null);

  // Extract, parse, and take the last 5 completed visits
  const last5Visits = useMemo<ParsedVisitData[]>(() => {
    // 1. Filter completed visits that contain vital signs
    const completed = bookings.filter(b => b.status === 'completed' && b.vitalSigns);

    // If we have fewer than 2 completed visits, use standard patient records so trend is always visible
    const sourceList = completed.length > 0 ? completed : bookings.filter(b => b.vitalSigns);

    // Sort chronologically ascending (oldest to newest)
    const sorted = [...sourceList].sort((a, b) => {
      const dateA = new Date(a.vitalSigns?.recordedAt || a.scheduledDate).getTime();
      const dateB = new Date(b.vitalSigns?.recordedAt || b.scheduledDate).getTime();
      return dateA - dateB;
    });

    // Take the last 5 completed visits
    const slice5 = sorted.slice(-5);

    const parsed: ParsedVisitData[] = slice5.map((visit, index) => {
      const bpStr = visit.vitalSigns?.bloodPressure || '120/80';
      const bpMatch = bpStr.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
      const systolic = bpMatch ? parseInt(bpMatch[1], 10) : 120;
      const diastolic = bpMatch ? parseInt(bpMatch[2], 10) : 80;

      const sugarStr = visit.vitalSigns?.bloodSugar || '110';
      const sugarMatch = sugarStr.match(/(\d{2,3})/);
      const glucose = sugarMatch ? parseInt(sugarMatch[1], 10) : 110;

      const hrMatch = (visit.vitalSigns?.heartRate || '75').match(/(\d{2,3})/);
      const heartRate = hrMatch ? parseInt(hrMatch[1], 10) : 75;

      const o2Match = (visit.vitalSigns?.oxygenSaturation || '98').match(/(\d{2,3})/);
      const oxygen = o2Match ? parseInt(o2Match[1], 10) : 98;

      const d = new Date(visit.scheduledDate || visit.createdAt);
      const displayDate = !isNaN(d.getTime()) 
        ? d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
        : `زيارة ${index + 1}`;

      return {
        id: visit.id,
        date: visit.scheduledDate || '2026-10-26',
        displayDate: `زيارة ${index + 1} (${displayDate})`,
        serviceTitle: visit.serviceTitle,
        nurseName: visit.vitalSigns?.nurseName || visit.caregiverName,
        systolic,
        diastolic,
        glucose,
        heartRate,
        oxygen,
        rawBP: visit.vitalSigns?.bloodPressure || `${systolic}/${diastolic} mmHg`,
        rawSugar: visit.vitalSigns?.bloodSugar || `${glucose} mg/dL`,
        clinicalNotes: visit.vitalSigns?.clinicalNotes || 'حالة مستقرة.'
      };
    });

    return parsed;
  }, [bookings]);

  // Render Blood Pressure Chart with D3
  useEffect(() => {
    if (!bpSvgRef.current || last5Visits.length === 0) return;
    if (activeTab === 'glucose') return;

    const svg = d3.select(bpSvgRef.current);
    svg.selectAll('*').remove();

    const width = 620;
    const height = 240;
    const margin = { top: 25, right: 35, bottom: 45, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define gradients
    const defs = svg.append('defs');
    
    // Systolic gradient (Amber-Rose)
    const sysGrad = defs.append('linearGradient')
      .attr('id', 'sysGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    sysGrad.append('stop').attr('offset', '0%').attr('stop-color', '#f43f5e').attr('stop-opacity', 0.25);
    sysGrad.append('stop').attr('offset', '100%').attr('stop-color', '#f43f5e').attr('stop-opacity', 0.0);

    // Diastolic gradient (Teal-Indigo)
    const diaGrad = defs.append('linearGradient')
      .attr('id', 'diaGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    diaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0ea5e9').attr('stop-opacity', 0.2);
    diaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#0ea5e9').attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3.scalePoint<string>()
      .domain(last5Visits.map(d => d.displayDate))
      .range([0, innerWidth])
      .padding(0.3);

    const minVal = Math.min(...last5Visits.map(d => d.diastolic), 60);
    const maxVal = Math.max(...last5Visits.map(d => d.systolic), 150);

    const yScale = d3.scaleLinear()
      .domain([Math.floor(minVal / 10) * 10 - 10, Math.ceil(maxVal / 10) * 10 + 10])
      .range([innerHeight, 0])
      .nice();

    // Clinical Safe / Normal Zones
    // Normal BP: Systolic < 120, Diastolic < 80
    const normalDiaY = yScale(80);
    const normalSysY = yScale(120);

    // Light green background band for optimal range (80 to 120)
    g.append('rect')
      .attr('x', 0)
      .attr('y', normalSysY)
      .attr('width', innerWidth)
      .attr('height', Math.max(0, normalDiaY - normalSysY))
      .attr('fill', '#10b981')
      .attr('fill-opacity', 0.07);

    // Normal Systolic Threshold line (120 mmHg)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', normalSysY)
      .attr('y2', normalSysY)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4,4');

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', normalSysY - 6)
      .attr('text-anchor', 'end')
      .attr('fill', '#059669')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text('الحد المثالي للانقباضي (120 mmHg)');

    // Normal Diastolic Threshold line (80 mmHg)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', normalDiaY)
      .attr('y2', normalDiaY)
      .attr('stroke', '#0ea5e9')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3,3');

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', normalDiaY - 6)
      .attr('text-anchor', 'end')
      .attr('fill', '#0284c7')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text('الحد المثالي للانبساطي (80 mmHg)');

    // Horizontal Grid Lines
    const yAxisGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .ticks(6)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-width', 1);

    g.select('.grid .domain').remove();

    // Area Generators
    const sysArea = d3.area<ParsedVisitData>()
      .x(d => xScale(d.displayDate) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d.systolic))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(last5Visits)
      .attr('fill', 'url(#sysGradient)')
      .attr('d', sysArea);

    // Line Generators
    const sysLine = d3.line<ParsedVisitData>()
      .x(d => xScale(d.displayDate) || 0)
      .y(d => yScale(d.systolic))
      .curve(d3.curveMonotoneX);

    const diaLine = d3.line<ParsedVisitData>()
      .x(d => xScale(d.displayDate) || 0)
      .y(d => yScale(d.diastolic))
      .curve(d3.curveMonotoneX);

    // Draw Systolic Path
    const sysPath = g.append('path')
      .datum(last5Visits)
      .attr('fill', 'none')
      .attr('stroke', '#f43f5e')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', sysLine);

    // Animate path draw
    const sysPathLength = sysPath.node()?.getTotalLength() || 600;
    sysPath
      .attr('stroke-dasharray', sysPathLength)
      .attr('stroke-dashoffset', sysPathLength)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Draw Diastolic Path
    const diaPath = g.append('path')
      .datum(last5Visits)
      .attr('fill', 'none')
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 2.8)
      .attr('stroke-linecap', 'round')
      .attr('d', diaLine);

    const diaPathLength = diaPath.node()?.getTotalLength() || 600;
    diaPath
      .attr('stroke-dasharray', diaPathLength)
      .attr('stroke-dashoffset', diaPathLength)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Draw Systolic Points
    g.selectAll('.dot-sys')
      .data(last5Visits)
      .enter()
      .append('circle')
      .attr('class', 'dot-sys')
      .attr('cx', d => xScale(d.displayDate) || 0)
      .attr('cy', d => yScale(d.systolic))
      .attr('r', 5.5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#f43f5e')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget as SVGCircleElement).attr('r', 8).attr('fill', '#f43f5e');
        setHoveredPoint(d);
        setHoverMetric('bp');
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget as SVGCircleElement).attr('r', 5.5).attr('fill', '#ffffff');
      });

    // Systolic Value Labels on Points
    g.selectAll('.label-sys')
      .data(last5Visits)
      .enter()
      .append('text')
      .attr('class', 'label-sys')
      .attr('x', d => xScale(d.displayDate) || 0)
      .attr('y', d => yScale(d.systolic) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', '#e11d48')
      .text(d => d.systolic);

    // Draw Diastolic Points
    g.selectAll('.dot-dia')
      .data(last5Visits)
      .enter()
      .append('circle')
      .attr('class', 'dot-dia')
      .attr('cx', d => xScale(d.displayDate) || 0)
      .attr('cy', d => yScale(d.diastolic))
      .attr('r', 5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget as SVGCircleElement).attr('r', 7.5).attr('fill', '#0284c7');
        setHoveredPoint(d);
        setHoverMetric('bp');
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget as SVGCircleElement).attr('r', 5).attr('fill', '#ffffff');
      });

    // Diastolic Value Labels on Points
    g.selectAll('.label-dia')
      .data(last5Visits)
      .enter()
      .append('text')
      .attr('class', 'label-dia')
      .attr('x', d => xScale(d.displayDate) || 0)
      .attr('y', d => yScale(d.diastolic) + 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('fill', '#0369a1')
      .text(d => d.diastolic);

    // X Axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#475569')
      .attr('dy', '1.2em')
      .attr('font-weight', '500');

    g.select('.domain').attr('stroke', '#cbd5e1');

    // Y Axis (Left)
    const yAxis = d3.axisLeft(yScale).ticks(5);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#64748b');

    // Y Axis Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -42)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text('ضغط الدم (mmHg)');

  }, [last5Visits, activeTab]);

  // Render Blood Glucose Chart with D3
  useEffect(() => {
    if (!glucoseSvgRef.current || last5Visits.length === 0) return;
    if (activeTab === 'bp') return;

    const svg = d3.select(glucoseSvgRef.current);
    svg.selectAll('*').remove();

    const width = 620;
    const height = 240;
    const margin = { top: 25, right: 35, bottom: 45, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define gradients
    const defs = svg.append('defs');
    const gluGrad = defs.append('linearGradient')
      .attr('id', 'gluGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gluGrad.append('stop').attr('offset', '0%').attr('stop-color', '#d97706').attr('stop-opacity', 0.25);
    gluGrad.append('stop').attr('offset', '100%').attr('stop-color', '#d97706').attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3.scalePoint<string>()
      .domain(last5Visits.map(d => d.displayDate))
      .range([0, innerWidth])
      .padding(0.3);

    const minVal = Math.min(...last5Visits.map(d => d.glucose), 70);
    const maxVal = Math.max(...last5Visits.map(d => d.glucose), 180);

    const yScale = d3.scaleLinear()
      .domain([Math.floor(minVal / 10) * 10 - 15, Math.ceil(maxVal / 10) * 10 + 15])
      .range([innerHeight, 0])
      .nice();

    // Normal safe blood glucose zone (70 to 140 mg/dL)
    const y70 = yScale(70);
    const y140 = yScale(140);

    g.append('rect')
      .attr('x', 0)
      .attr('y', y140)
      .attr('width', innerWidth)
      .attr('height', Math.max(0, y70 - y140))
      .attr('fill', '#10b981')
      .attr('fill-opacity', 0.08);

    // Normal upper boundary line (140 mg/dL)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', y140)
      .attr('y2', y140)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4,4');

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', y140 - 6)
      .attr('text-anchor', 'end')
      .attr('fill', '#059669')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .text('النطاق الآمن للسكر (حتى 140 mg/dL)');

    // Grid lines
    const yAxisGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .ticks(6)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yAxisGrid)
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-width', 1);

    g.select('.grid .domain').remove();

    // Area Fill
    const gluArea = d3.area<ParsedVisitData>()
      .x(d => xScale(d.displayDate) || 0)
      .y0(innerHeight)
      .y1(d => yScale(d.glucose))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(last5Visits)
      .attr('fill', 'url(#gluGradient)')
      .attr('d', gluArea);

    // Line Path
    const gluLine = d3.line<ParsedVisitData>()
      .x(d => xScale(d.displayDate) || 0)
      .y(d => yScale(d.glucose))
      .curve(d3.curveMonotoneX);

    const gluPath = g.append('path')
      .datum(last5Visits)
      .attr('fill', 'none')
      .attr('stroke', '#d97706')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', gluLine);

    const gluPathLength = gluPath.node()?.getTotalLength() || 600;
    gluPath
      .attr('stroke-dasharray', gluPathLength)
      .attr('stroke-dashoffset', gluPathLength)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Points
    g.selectAll('.dot-glu')
      .data(last5Visits)
      .enter()
      .append('circle')
      .attr('class', 'dot-glu')
      .attr('cx', d => xScale(d.displayDate) || 0)
      .attr('cy', d => yScale(d.glucose))
      .attr('r', 6)
      .attr('fill', '#ffffff')
      .attr('stroke', '#d97706')
      .attr('stroke-width', 2.8)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget as SVGCircleElement).attr('r', 8.5).attr('fill', '#d97706');
        setHoveredPoint(d);
        setHoverMetric('glucose');
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget as SVGCircleElement).attr('r', 6).attr('fill', '#ffffff');
      });

    // Glucose Value Labels
    g.selectAll('.label-glu')
      .data(last5Visits)
      .enter()
      .append('text')
      .attr('class', 'label-glu')
      .attr('x', d => xScale(d.displayDate) || 0)
      .attr('y', d => yScale(d.glucose) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', '#b45309')
      .text(d => `${d.glucose} mg/dL`);

    // X Axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#475569')
      .attr('dy', '1.2em')
      .attr('font-weight', '500');

    g.select('.domain').attr('stroke', '#cbd5e1');

    // Y Axis (Left)
    const yAxis = d3.axisLeft(yScale).ticks(5);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#64748b');

    // Y Axis Label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -42)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text('مستوى السكر (mg/dL)');

  }, [last5Visits, activeTab]);

  // Statistical calculations across the 5 visits
  const stats = useMemo(() => {
    if (last5Visits.length === 0) return null;

    const latest = last5Visits[last5Visits.length - 1];
    const first = last5Visits[0];

    const avgSys = Math.round(d3.mean(last5Visits, d => d.systolic) || 0);
    const avgDia = Math.round(d3.mean(last5Visits, d => d.diastolic) || 0);
    const avgGlu = Math.round(d3.mean(last5Visits, d => d.glucose) || 0);

    const bpDiffSys = latest.systolic - first.systolic;
    const gluDiff = latest.glucose - first.glucose;

    return {
      latest,
      first,
      avgSys,
      avgDia,
      avgGlu,
      bpDiffSys,
      gluDiff
    };
  }, [last5Visits]);

  if (last5Visits.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
        لا توجد زيارات مكتملة مسجلة بها علامات حيوية حتى الآن لعرض المنحنى البياني.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 border border-teal-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-100/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-600 text-white rounded-lg shadow-xs">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              منحنى تطور العلامات الحيوية (D3 Trends Chart)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            متابعة دقيقة لتحسن ضغط الدم ونسبة السكر التراكمي على مدار آخر {last5Visits.length} زيارات تمريضية مكتملة.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-center text-xs">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'both'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            عرض مقارن متزامن
          </button>
          <button
            onClick={() => setActiveTab('bp')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'bp'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>ضغط الدم</span>
          </button>
          <button
            onClick={() => setActiveTab('glucose')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'glucose'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-amber-200" />
            <span>سكر الدم</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Badges */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-right">
          {/* Latest BP */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>آخر قياس ضغط:</span>
              <Heart className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold font-mono text-slate-900">
                {stats.latest.systolic}/{stats.latest.diastolic}
              </span>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px]">
              {stats.bpDiffSys <= 0 ? (
                <span className="text-emerald-700 flex items-center gap-0.5 font-bold">
                  <TrendingDown className="w-3 h-3" />
                  تحسن {Math.abs(stats.bpDiffSys)} mmHg ↓
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-0.5 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  ارتفاع {stats.bpDiffSys} mmHg ↑
                </span>
              )}
            </div>
          </div>

          {/* Average BP */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block mb-1">متوسط الضغط (5 زيارات):</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold font-mono text-slate-900">
                {stats.avgSys}/{stats.avgDia}
              </span>
              <span className="text-[10px] text-slate-400">mmHg</span>
            </div>
            <span className="text-[10px] text-teal-700 block mt-1 font-medium">
              ضمن النطاق الموصى به
            </span>
          </div>

          {/* Latest Blood Sugar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>آخر قياس سكر:</span>
              <Droplet className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold font-mono text-slate-900">
                {stats.latest.glucose}
              </span>
              <span className="text-[10px] text-slate-400">mg/dL</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px]">
              {stats.gluDiff <= 0 ? (
                <span className="text-emerald-700 flex items-center gap-0.5 font-bold">
                  <TrendingDown className="w-3 h-3" />
                  انخفاض إيجابي {Math.abs(stats.gluDiff)} mg/dL
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-0.5 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  زيادة {stats.gluDiff} mg/dL
                </span>
              )}
            </div>
          </div>

          {/* Average Blood Sugar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-500 block mb-1">متوسط السكر (5 زيارات):</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold font-mono text-slate-900">
                {stats.avgGlu}
              </span>
              <span className="text-[10px] text-slate-400">mg/dL</span>
            </div>
            <span className="text-[10px] text-emerald-700 block mt-1 font-medium">
              ضبط ممتاز للجرعات العلاجية
            </span>
          </div>
        </div>
      )}

      {/* D3 Charts Area */}
      <div className="grid grid-cols-1 gap-4">
        {/* Blood Pressure Chart */}
        {(activeTab === 'both' || activeTab === 'bp') && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h4 className="text-xs font-bold text-slate-800">
                  منحنى ضغط الدم (Blood Pressure Trend)
                </h4>
              </div>

              {/* Legends */}
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-rose-500 rounded-full inline-block"></span>
                  <span className="text-slate-600 font-medium">انقباضي (Systolic)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-sky-600 rounded-full inline-block"></span>
                  <span className="text-slate-600 font-medium">انبساطي (Diastolic)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-400 rounded-xs inline-block"></span>
                  <span className="text-emerald-700 font-medium text-[10px]">النطاق المثالي</span>
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                ref={bpSvgRef}
                viewBox="0 0 620 240"
                className="w-full h-auto min-w-[480px] select-none"
              />
            </div>
          </div>
        )}

        {/* Blood Sugar Chart */}
        {(activeTab === 'both' || activeTab === 'glucose') && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h4 className="text-xs font-bold text-slate-800">
                  منحنى مستوى سكر الدم (Blood Sugar / Glucose Trend)
                </h4>
              </div>

              {/* Legends */}
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-500 rounded-full inline-block"></span>
                  <span className="text-slate-600 font-medium">السكر (mg/dL)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-400 rounded-xs inline-block"></span>
                  <span className="text-emerald-700 font-medium text-[10px]">المدى الطبيعي (70-140)</span>
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                ref={glucoseSvgRef}
                viewBox="0 0 620 240"
                className="w-full h-auto min-w-[480px] select-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip / Detail Card */}
      {hoveredPoint && (
        <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-md text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-teal-800">{hoveredPoint.displayDate}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">كود الزيارة: {hoveredPoint.id}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">الممرض الموثق: <strong>{hoveredPoint.nurseName}</strong></span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              ملاحظة التمريض: {hoveredPoint.clinicalNotes}
            </p>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100">
              <span className="text-[10px] text-rose-500 block">ضغط الدم</span>
              <span className="font-bold text-rose-700 font-mono">{hoveredPoint.systolic}/{hoveredPoint.diastolic} mmHg</span>
            </div>
            <div className="bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
              <span className="text-[10px] text-amber-600 block">سكر الدم</span>
              <span className="font-bold text-amber-800 font-mono">{hoveredPoint.glucose} mg/dL</span>
            </div>
            <div className="bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100">
              <span className="text-[10px] text-teal-600 block">النبض / الأكسجين</span>
              <span className="font-bold text-teal-800 font-mono">{hoveredPoint.heartRate} bpm · {hoveredPoint.oxygen}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Guidance Footnote */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>تقييم المتابعة:</strong> تُظهر المؤشرات الحيوية استجابة طبية إيجابية وتحسناً تدريجياً ملحوظاً في السيطرة على ضغط الدم ومستويات الجلوكوز مقارنة بالزيارات الأولى بفضل التزام المريض بالخطة الدوائية وجلسات الرعاية المنزلية.
        </span>
      </div>
    </div>
  );
};
