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
    <div className="min-h-screen bg-paper bg-grain">
      <ScrollToTop />
      <Sidebar />
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-out-soft">
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
