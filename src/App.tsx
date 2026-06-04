import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DailyEnglish from './pages/DailyEnglish';
import WordDetail from './pages/WordDetail';
import DrivingTest from './pages/DrivingTest';
import TodayInHistory from './pages/TodayInHistory';

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
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
