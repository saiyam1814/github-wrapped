import { motion } from 'framer-motion';
import { developerNarratives } from '../../lib/narratives';
import { Code2 } from 'lucide-react';

const LanguagesSlide = ({ data }) => {
  const { languages } = data;
  const narratives = developerNarratives.languages;

  // Get top 5 languages
  const topLanguages = languages.all.slice(0, 5);
  const maxPercentage = parseFloat(topLanguages[0]?.percentage || 0);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <p className="text-xl md:text-2xl text-gray-400 mb-2">
          Your primary language
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white">
          {languages.top?.name || 'Code'}
        </h1>
      </motion.div>

      {/* Language bars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xl space-y-4"
      >
        {topLanguages.map((lang, index) => {
          const width = (parseFloat(lang.percentage) / maxPercentage) * 100;
          
          return (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.15 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-white font-medium">{lang.name}</span>
                </div>
                <span className="text-gray-400 text-sm">{lang.percentage}%</span>
              </div>
              
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ 
                    delay: 0.8 + index * 0.15,
                    duration: 1,
                    ease: "easeOut"
                  }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: lang.color,
                    boxShadow: `0 0 20px ${lang.color}50`
                  }}
                />
              </div>
              
              {/* Repo count badge */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="absolute right-0 top-0 text-xs text-gray-500"
              >
                {lang.repoCount} repos
              </motion.span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-10 text-center max-w-lg"
      >
        {languages.isPolyglot ? (
          <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <p className="text-gray-300">
              {narratives.polyglot(languages.count)}
            </p>
          </div>
        ) : languages.isSpecialist ? (
          <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <Code2 className="w-5 h-5 text-orange-400" />
            <p className="text-gray-300">
              {narratives.specialist(languages.top?.name, languages.topLanguagePercentage)}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">
            A diverse mix of {languages.count} languages in your toolkit.
          </p>
        )}
      </motion.div>

      {/* Language color legend at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
      >
        <div className="flex gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          {topLanguages.slice(0, 4).map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-xs text-gray-500">{lang.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LanguagesSlide;


