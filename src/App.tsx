import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DailyEnglish from './pages/DailyEnglish';
import WordDetail from './pages/WordDetail';
import DrivingTest from './pages/DrivingTest';
import TodayInHistory from './pages/TodayInHistory';
import SanguoHeroes from './pages/SanguoHeroes';
import Translator from './pages/Translator';
import Proverbs from './pages/Proverbs';
import Idioms from './pages/Idioms';
import MathQuiz from './pages/MathQuiz';
import Poetry from './pages/Poetry';
import ChemicalElement from './pages/ChemicalElement';
import EquationBalancer from './pages/EquationBalancer';
import IdiomDictionary from './pages/IdiomDictionary';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="min-h-screen bg-paper bg-aurora relative">
      {/* Floating ambient blobs */}
      <div className="fixed top-20 right-20 w-72 h-72 bg-amber/[0.04] rounded-full blur-3xl pointer-events-none animate-breathe" style={{ animationDuration: '12s' }} />
      <div className="fixed bottom-20 left-40 w-96 h-96 bg-teal/[0.03] rounded-full blur-3xl pointer-events-none animate-breathe" style={{ animationDuration: '15s', animationDelay: '3s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ink/[0.015] rounded-full blur-3xl pointer-events-none animate-breathe" style={{ animationDuration: '18s', animationDelay: '6s' }} />

      <ScrollToTop />
      <Sidebar />
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-out-soft relative">
        <div className="max-w-5xl mx-auto p-5 sm:p-8 md:p-10 lg:px-12">
          <Routes>
            <Route path="/" element={<Navigate to="/daily-english" replace />} />
            <Route path="/daily-english" element={<DailyEnglish />} />
            <Route path="/word-detail" element={<WordDetail />} />
            <Route path="/driving-test" element={<DrivingTest />} />
            <Route path="/today-history" element={<TodayInHistory />} />
            <Route path="/sanguo-heroes" element={<SanguoHeroes />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/proverbs" element={<Proverbs />} />
            <Route path="/idioms" element={<Idioms />} />
            <Route path="/math-quiz" element={<MathQuiz />} />
            <Route path="/poetry" element={<Poetry />} />
            <Route path="/chemical-element" element={<ChemicalElement />} />
            <Route path="/equation-balancer" element={<EquationBalancer />} />
            <Route path="/idiom" element={<IdiomDictionary />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
