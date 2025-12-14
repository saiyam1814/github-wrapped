import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Donut chart for language distribution
 */
const LanguageChart = ({ languages, size = 200, className = '' }) => {
  const chartData = useMemo(() => {
    if (!languages || languages.length === 0) return [];

    const total = languages.reduce((sum, l) => sum + parseFloat(l.percentage), 0);
    let startAngle = 0;

    return languages.slice(0, 6).map((lang, i) => {
      const percentage = parseFloat(lang.percentage);
      const angle = (percentage / total) * 360;
      const segment = {
        ...lang,
        startAngle,
        endAngle: startAngle + angle,
        percentage,
      };
      startAngle += angle;
      return segment;
    });
  }, [languages]);

  const radius = size / 2;
  const innerRadius = radius * 0.6;
  const centerX = radius;
  const centerY = radius;

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (cx, cy, outerR, innerR, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, outerR, endAngle);
    const end = polarToCartesian(cx, cy, outerR, startAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      'M', start.x, start.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius - 2}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={radius - innerRadius}
        />
        
        {/* Chart segments */}
        {chartData.map((segment, i) => (
          <motion.path
            key={segment.name}
            d={describeArc(centerX, centerY, radius - 2, innerRadius, segment.startAngle, segment.endAngle - 0.5)}
            fill={segment.color || '#6366f1'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              filter: `drop-shadow(0 0 6px ${segment.color}40)`,
            }}
          />
        ))}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{languages.length}</div>
          <div className="text-xs text-gray-500">Languages</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {chartData.slice(0, 4).map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-2"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-xs text-gray-400">{lang.name}</span>
            <span className="text-xs text-gray-600">{lang.percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LanguageChart;


