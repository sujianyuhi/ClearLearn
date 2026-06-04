import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <div className="p-6 md:p-10">
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
