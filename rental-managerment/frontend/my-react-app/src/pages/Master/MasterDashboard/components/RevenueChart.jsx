import React from 'react';

const RevenueChart = ({ chartData, range, setRange }) => {
  const width = 800;
  const height = 320;
  const chartHeight = 250;
  const padding = 20;

  const generateLinePath = () => {
    if (!chartData || chartData.length < 2) return "";
    const maxVal = Math.max(...chartData.map(d => d.amount)) || 1;

    return chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const y = chartHeight - (d.amount / maxVal) * (chartHeight - padding * 2) - padding;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaPath = () => {
    if (!chartData || chartData.length < 2) return "";
    const linePath = generateLinePath();
    return `${linePath} L ${width} ${chartHeight} L 0 ${chartHeight} Z`;
  };

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase mb-1">Xu hướng doanh thu</h3>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded animate-pulse"></div>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Dữ liệu theo chu kỳ {range} tháng</p>
           </div>
        </div>
        <div className="flex bg-slate-50 p-1 rounded border border-slate-100 shadow-inner">
          <button 
            onClick={() => setRange(6)}
            className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
              ${range === 6 ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            6 Tháng
          </button>
          <button 
            onClick={() => setRange(12)}
            className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
              ${range === 12 ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            1 Năm
          </button>
        </div>
      </div>
      
      <div className="relative flex-1 min-h-[350px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {chartData?.map((d, i) => {
            const x = (i / (chartData.length - 1)) * width;
            return (
              <React.Fragment key={i}>
                <line x1={x} y1="0" x2={x} y2={chartHeight} stroke="#f8fafc" strokeWidth="1" strokeDasharray="4" />
                <text 
                  x={x} 
                  y={chartHeight + 35} 
                  textAnchor="middle" 
                  className={`text-[10px] font-black uppercase tracking-tighter ${i === chartData.length - 1 ? 'fill-emerald-600' : 'fill-slate-400 font-bold'}`}
                  style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif' }}
                >
                  {d.month}
                </text>
              </React.Fragment>
            );
          })}

          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1="0" y1={g * 80} x2={width} y2={g * 80} stroke="#f8fafc" strokeWidth="1" />
          ))}

          <path d={generateAreaPath()} fill="url(#areaGradient)" />
          <path 
            d={generateLinePath()} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.15)] transition-all duration-1000"
          />

          {chartData?.map((d, i) => {
            const maxVal = Math.max(...chartData.map(val => val.amount)) || 1;
            const x = (i / (chartData.length - 1)) * width;
            const y = chartHeight - (d.amount / maxVal) * (chartHeight - padding * 2) - padding;
            return (
              <g key={i} className="group/dot cursor-pointer">
                <circle 
                  cx={x} cy={y} r="5" 
                  fill="white" stroke="#10b981" strokeWidth="3"
                  className="group-hover/dot:r-7 transition-all"
                />
                <foreignObject x={x - 40} y={y - 45} width="80" height="40" className="opacity-0 group-hover/dot:opacity-100 transition-opacity">
                   <div className="bg-slate-900 text-white text-[8px] font-black px-2 py-1.5 rounded-lg text-center whitespace-nowrap shadow-2xl">
                     {(d.amount / 1000000).toFixed(1)}M VNĐ
                   </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default RevenueChart;
