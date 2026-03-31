import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import HomeLoop from './pages/home/HomeLoop';
import StudySelect from './pages/study/StudySelect';
import StudySwipeMode from './pages/study/StudySwipeMode';
import ItemsPage from './pages/items/ItemsPage';
import LawViva from './pages/law/LawViva';

// Pages with bottom nav
const NAV_PAGES = ['/home', '/select', '/items', '/law'];

const NAV_ITEMS = [
  { path: '/home',   icon: '⛺', label: 'Base'    },
  { path: '/select', icon: '📚', label: 'Estudar' },
  { path: '/items',  icon: '🎒', label: 'Mochila' },
  { path: '/law',    icon: '⚖️',  label: 'Leis'   },
];

function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  if (!NAV_PAGES.includes(location.pathname)) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 600,
      backgroundColor: '#0F172A',
      borderTop: '2px solid #1E293B',
      display: 'flex', zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1, padding: '12px 0 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              backgroundColor: 'transparent',
              borderTop: `2px solid ${isActive ? '#EF4444' : 'transparent'}`,
              transition: 'border-color 0.2s',
            }}
          >
            <motion.span
              animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
              {item.icon}
            </motion.span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 800,
              color: isActive ? '#EF4444' : '#475569',
              textTransform: 'uppercase', letterSpacing: 0.5
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const showNav = NAV_PAGES.includes(location.pathname);

  return (
    <div style={{ margin: '0 auto', maxWidth: 600, minHeight: '100vh', position: 'relative', overflowX: 'hidden', paddingBottom: showNav ? 72 : 0, backgroundColor: '#0F172A', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/home"       element={<HomeLoop />} />
          <Route path="/select"     element={<StudySelect />} />
          <Route path="/study"      element={<StudySwipeMode />} />
          <Route path="/items"      element={<ItemsPage />} />
          <Route path="/law"        element={<LawViva />} />
        </Routes>
      </AnimatePresence>
      <BottomNavbar />
    </div>
  );
}

export default App;
