import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './layout/Navbar';
import FinanceCopilot from './components/FinanceCopilot';

function Home() {
  return <main style={styles.page}>Welcome to FinanceSphere Home.</main>;
}

function Dashboard() {
  return <main style={styles.page}>FinanceSphere Dashboard</main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/copilot" element={<FinanceCopilot />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  page: {
    padding: '2rem 1rem',
    maxWidth: '1100px',
    margin: '0 auto',
    color: '#0f172a',
  },
};
