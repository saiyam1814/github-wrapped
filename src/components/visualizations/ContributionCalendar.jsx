import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * GitHub-style contribution calendar heatmap
 */
const ContributionCalendar = ({ data, className = '' }) => {
  // Process calendar data into weeks
  const { weeks, maxCount, totalContributions } = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return { weeks: [], maxCount: 0, totalContributions: 0 };
    }

    const weeksMap = [];
    let currentWeek = [];
    let max = 0;
    let total = 0;

    data.forEach((day, index) => {
      if (day.contributionCount > max) {
        max = day.contributionCount;
      }
      total += day.contributionCount;
      
      currentWeek.push(day);
      
      // Start new week on Sunday (weekday 0)
      if (day.weekday === 6 || index === data.length - 1) {
        weeksMap.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return { weeks: weeksMap, maxCount: max, totalContributions: total };
  }, [data]);

  const getColor = (count) => {
    if (count === 0) return 'bg-white/[0.03]';
    
    const intensity = maxCount > 0 ? count / maxCount : 0;
    
    if (intensity > 0.75) return 'bg-indigo-400';
    if (intensity > 0.5) return 'bg-indigo-500';
    if (intensity > 0.25) return 'bg-indigo-600';
    return 'bg-indigo-700/70';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className={`${className}`}>
      {/* Month labels */}
      <div className="flex gap-1 mb-2 text-xs text-gray-500 pl-8">
        {months.map((month, i) => (
          <div key={month} className="flex-1 text-center">
            {i % 2 === 0 ? month : ''}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 text-xs text-gray-500 pr-2">
          <span className="h-3" />
          <span className="h-3">Mon</span>
          <span className="h-3" />
          <span className="h-3">Wed</span>
          <span className="h-3" />
          <span className="h-3">Fri</span>
          <span className="h-3" />
        </div>

        {/* Calendar grid */}
        <div className="flex gap-[3px] flex-1 overflow-hidden">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: (weekIndex * 7 + dayIndex) * 0.002,
                    duration: 0.2
                  }}
                  className={`w-3 h-3 rounded-sm ${getColor(day.contributionCount)} transition-all hover:ring-2 hover:ring-white/30 cursor-pointer`}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-white/[0.03]" />
          <div className="w-3 h-3 rounded-sm bg-indigo-700/70" />
          <div className="w-3 h-3 rounded-sm bg-indigo-600" />
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <div className="w-3 h-3 rounded-sm bg-indigo-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionCalendar;


