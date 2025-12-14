import { motion } from 'framer-motion';
import { ProgressRing } from '../ui/ProgressRing';
import { FileText, Users, Shield, Scale, MessageSquare, AlertTriangle } from 'lucide-react';

const ProjectHealthSlide = ({ data }) => {
  const { health, community } = data;

  const healthItems = [
    { key: 'readme', label: 'README', icon: FileText, has: health.hasReadme },
    { key: 'contributing', label: 'Contributing Guide', icon: Users, has: health.hasContributing },
    { key: 'coc', label: 'Code of Conduct', icon: Shield, has: health.hasCodeOfConduct },
    { key: 'license', label: 'License', icon: Scale, has: health.hasLicense },
    { key: 'issues', label: 'Issues Enabled', icon: MessageSquare, has: health.hasIssuesEnabled },
  ];

  const getBusFactorColor = (factor) => {
    if (factor >= 5) return 'text-green-400';
    if (factor >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBusFactorMessage = (factor) => {
    if (factor >= 5) return 'Healthy distribution';
    if (factor >= 3) return 'Good coverage';
    if (factor >= 2) return 'Could use more contributors';
    return 'High risk - single maintainer';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-gray-400 mb-8"
      >
        Project Health Score
      </motion.p>

      {/* Health Score Ring */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="mb-8"
      >
        <ProgressRing
          progress={health.communityScore}
          size={180}
          strokeWidth={12}
          color={health.communityScore >= 70 ? '#10b981' : health.communityScore >= 40 ? '#f59e0b' : '#ef4444'}
        >
          <div className="text-center">
            <div className="text-5xl font-black text-white">{health.communityScore}</div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </ProgressRing>
      </motion.div>

      {/* Health Checklist */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg mb-8"
      >
        {healthItems.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className={`flex items-center gap-2 p-3 rounded-xl ${
              item.has 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${item.has ? 'bg-green-500/20' : 'bg-white/10'}`}>
              <item.icon className={`w-4 h-4 ${item.has ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-sm ${item.has ? 'text-green-400' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bus Factor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-md p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 ${getBusFactorColor(health.busFactor)}`} />
            <div>
              <div className="text-sm text-gray-400">Bus Factor</div>
              <div className={`text-lg font-bold ${getBusFactorColor(health.busFactor)}`}>
                {health.busFactor}
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {getBusFactorMessage(health.busFactor)}
          </span>
        </div>
      </motion.div>

      {/* Contributors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-6 flex items-center gap-3"
      >
        <div className="flex -space-x-2">
          {community.topContributors?.slice(0, 5).map((contrib, i) => (
            <motion.img
              key={contrib.login}
              src={contrib.avatarUrl}
              alt={contrib.login}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + i * 0.1 }}
              className="w-8 h-8 rounded-full border-2 border-gray-900"
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {community.totalContributors} total contributors
        </span>
      </motion.div>
    </div>
  );
};

export default ProjectHealthSlide;


