import { motion } from 'framer-motion';

/**
 * 24x7 Activity heatmap (Hour x Day)
 */
const ActivityHeatmap = ({ weekdayDistribution, className = '' }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // For demo, distribute hourly based on weekday totals
  // In production, this would use actual hourly commit data
  const getHourlyEstimate = (day, hour) => {
    const dayTotal = weekdayDistribution[day] || 0;
    
    // Estimate distribution: higher in afternoon/evening
    const hourWeight = 
      hour >= 9 && hour <= 11 ? 0.8 :
      hour >= 12 && hour <= 14 ? 0.7 :
      hour >= 15 && hour <= 18 ? 1.0 :
      hour >= 19 && hour <= 22 ? 0.9 :
      hour >= 23 || hour <= 6 ? 0.2 :
      0.5;
    
    return (dayTotal / 52) * hourWeight; // Average per week
  };

  const maxValue = Math.max(
    ...days.flatMap((_, d) => hours.map(h => getHourlyEstimate(d, h)))
  );

  const getColor = (value) => {
    if (value === 0) return 'bg-white/[0.02]';
    const intensity = maxValue > 0 ? value / maxValue : 0;
    
    if (intensity > 0.75) return 'bg-indigo-400';
    if (intensity > 0.5) return 'bg-indigo-500';
    if (intensity > 0.25) return 'bg-indigo-600';
    if (intensity > 0) return 'bg-indigo-700/50';
    return 'bg-white/[0.02]';
  };

  return (
    <div className={className}>
      {/* Hour labels */}
      <div className="flex gap-1 mb-2 text-xs text-gray-600 ml-12">
        {hours.filter((_, i) => i % 3 === 0).map(hour => (
          <div key={hour} className="w-9 text-center">
            {hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour - 12}p`}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-1">
        {days.map((day, dayIndex) => (
          <div key={day} className="flex items-center gap-2">
            <span className="w-10 text-xs text-gray-500 text-right">{day}</span>
            <div className="flex gap-1">
              {hours.map((hour, hourIndex) => {
                const value = getHourlyEstimate(dayIndex, hour);
                return (
                  <motion.div
                    key={hour}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: (dayIndex * 24 + hourIndex) * 0.003,
                      duration: 0.2
                    }}
                    className={`w-3 h-3 rounded-sm ${getColor(value)} transition-all hover:ring-1 hover:ring-white/30`}
                    title={`${day} ${hour}:00 - ${value.toFixed(1)} avg contributions`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-white/[0.02]" />
          <div className="w-3 h-3 rounded-sm bg-indigo-700/50" />
          <div className="w-3 h-3 rounded-sm bg-indigo-600" />
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <div className="w-3 h-3 rounded-sm bg-indigo-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;


