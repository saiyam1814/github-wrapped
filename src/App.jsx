import { useState } from 'react';
import InputForm from './components/InputForm';
import WrappedCarousel from './components/WrappedCarousel';
import { fetchUserData, fetchProjectData, generateDemoData } from './utils/api';

function App() {
  const [view, setView] = useState('input'); // 'input' | 'loading' | 'wrapped'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async (type, identifier, token) => {
    setLoading(true);
    setError(null);

    try {
      const year = 2024;
      let result;

      if (type === 'demo') {
        // Demo mode - use generated demo data
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
        result = generateDemoData('developer');
      } else if (type === 'user') {
        // Developer wrapped
        result = await fetchUserData(identifier, year, token);
      } else if (type === 'project') {
        // Repository wrapped
        result = await fetchProjectData(identifier, year, token);
      } else {
        throw new Error('Invalid mode selected');
      }

      setData(result);
      setView('wrapped');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        err.message || 
        'Something went wrong. Please check your input and try again.'
      );
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {view === 'input' && (
        <InputForm 
          onStart={handleStart} 
          loading={loading} 
          error={error} 
        />
      )}

      {view === 'wrapped' && data && (
        <WrappedCarousel 
          data={data} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
}

export default App;

