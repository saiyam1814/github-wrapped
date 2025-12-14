import { motion } from 'framer-motion';
import { developerNarratives, formatMonth } from '../../lib/narratives';
import { Clock, Calendar, Sun, Moon, Sunset } from 'lucide-react';

const ActivitySlide = ({ data }) => {
  const { activity } = data;
  const narratives = developerNarratives.activity;

  // Get day names for distribution
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxDayContrib = Math.max(...Object.values(activity.weekdayDistribution));

  // Get time of day icon
  const getTimeIcon = (hour) => {
    if (hour >= 5 && hour < 12) return Sun;
    if (hour >= 12 && hour < 18) return Sunset;
    return Moon;
  };

  const TimeIcon = getTimeIcon(activity.busiestHour);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <p className="text-xl md:text-2xl text-gray-400 mb-2">
          When do you code best?
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-white">
          {activity.busiestDay}s
        </h1>
      </motion.div>

      {/* Weekly Distribution Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md mb-10"
      >
        <div className="flex items-end justify-between h-40 gap-2">
          {dayNames.map((day, index) => {
            const count = activity.weekdayDistribution[index] || 0;
            const height = (count / maxDayContrib) * 100;
            const isMax = day === activity.busiestDay.slice(0, 3);
            
            return (
              <motion.div
                key={day}
                className="flex-1 flex flex-col items-center"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ 
                    delay: 0.6 + index * 0.1,
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className={`w-full rounded-t-lg ${
                    isMax 
                      ? 'bg-gradient-to-t from-indigo-500 to-purple-400' 
                      : 'bg-white/10'
                  }`}
                  style={{
                    minHeight: '8px',
                    boxShadow: isMax ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.05 }}
                  className={`mt-2 text-xs ${isMax ? 'text-indigo-400 font-semibold' : 'text-gray-500'}`}
                >
                  {day}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl"
      >
        {/* Busiest Day */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="p-3 rounded-xl bg-indigo-500/10">
            <Calendar className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-left">
            <div className="text-sm text-gray-500">Busiest Day</div>
            <div className="text-lg font-bold text-white">{activity.busiestDay}</div>
            <div className="text-xs text-gray-500">{activity.busiestDayCount} contributions</div>
          </div>
        </div>

        {/* Peak Hour */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <TimeIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-left">
            <div className="text-sm text-gray-500">Peak Hours</div>
            <div className="text-lg font-bold text-white">
              {activity.busiestHour > 12 ? activity.busiestHour - 12 : activity.busiestHour}
              {activity.busiestHour >= 12 ? ' PM' : ' AM'}
            </div>
            <div className="text-xs text-gray-500">
              {activity.busiestHour >= 22 || activity.busiestHour < 5 ? 'Night Owl' : 
               activity.busiestHour < 9 ? 'Early Bird' : 'Business Hours'}
            </div>
          </div>
        </div>

        {/* Peak Month */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="p-3 rounded-xl bg-pink-500/10">
            <Clock className="w-6 h-6 text-pink-400" />
          </div>
          <div className="text-left">
            <div className="text-sm text-gray-500">Peak Month</div>
            <div className="text-lg font-bold text-white">
              {formatMonth(activity.peakMonth)}
            </div>
            <div className="text-xs text-gray-500">{activity.peakMonthCount} contributions</div>
          </div>
        </div>
      </motion.div>

      {/* Narrative */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-8 text-gray-400 text-center max-w-md"
      >
        {narratives.busiestDay(activity.busiestDay, activity.busiestDayCount)}
      </motion.p>

      {/* Weekend badge */}
      {activity.weekendRatio > 0.2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20"
        >
          <span className="text-purple-400 text-sm">
            🌙 {narratives.weekendWarrior(activity.weekendRatio)}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ActivitySlide;


