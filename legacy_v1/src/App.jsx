import { useState } from 'react';
import InputForm from './components/InputForm';
import { fetchUserData, fetchProjectData } from './utils/api';
import WrappedCarousel from './components/WrappedCarousel';

function App() {
  const [view, setView] = useState('input'); // 'input' | 'wrapped'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async (type, identifier, token) => {
    setLoading(true);
    setError(null);
    try {
      const year = 2024; // Fixed year for the wrapped
      let result;

      if (type === 'demo') {
        // Mock Data for Demo
        await new Promise(r => setTimeout(r, 1000)); // Fake loading
        result = {
          type: 'user',
          username: 'demo-user',
          name: 'Demo Architect',
          avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
          totalContributions: 8543,
          maxStreak: 124,
          topLanguages: ['TypeScript', 'Rust', 'Go', 'Python', 'React'],
          totalStars: 4521,
          busiestDay: 'Wednesday',
          totalPRs: 432,
          totalIssues: 120,
          ratio: '3.6'
        };
      } else if (type === 'user') {
        result = await fetchUserData(identifier, year, token);
      } else {
        result = await fetchProjectData(identifier, year, token);
      }

      setData(result);
      setView('wrapped');
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check the username/repo or your token.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setView('input');
    setData(null);
    setError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-900/30 rounded-full blur-[120px] pointer-events-none" />

      {view === 'input' && (
        <InputForm onStart={handleStart} loading={loading} error={error} />
      )}

      {view === 'wrapped' && (
        <WrappedCarousel data={data} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
