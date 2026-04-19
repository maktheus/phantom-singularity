import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import HomeLoop from './pages/home/HomeLoop';
import StudySelect from './pages/study/StudySelect';
import StudySwipeMode from './pages/study/StudySwipeMode';
import ItemsPage from './pages/items/ItemsPage';
import LawViva from './pages/law/LawViva';
import AuthPage from './pages/auth/AuthPage';
import { useAuthStore } from './services/authStore';
import { useAppStore } from './store/useAppStore';

// Pages that show the bottom navigation bar
const NAV_PAGES = ['/home', '/select', '/items', '/law'];
// Height of bottom nav bar (px) — used to offset CTA buttons above it
export const NAV_HEIGHT = 72;

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
      background: 'rgba(10,15,30,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', zIndex: 1000,
      paddingBottom: 'max(env(safe-area-inset-bottom), 4px)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1, padding: '10px 0 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              position: 'relative',
            }}
          >
            {/* Active pill indicator */}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: 'absolute',
                  top: 0, left: '20%', right: '20%', height: 2,
                  borderRadius: '0 0 4px 4px',
                  background: 'linear-gradient(90deg, #EF4444, #F97316)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div
              animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                width: 44, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 12,
                backgroundColor: isActive ? 'rgba(239,68,68,0.12)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{item.icon}</span>
            </motion.div>
            <span style={{
              fontSize: '0.62rem', fontWeight: 800,
              color: isActive ? '#EF4444' : '#334155',
              textTransform: 'uppercase', letterSpacing: 0.8,
              transition: 'color 0.2s',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const showNav = NAV_PAGES.includes(location.pathname);
  const { refreshSession } = useAuthStore();
  const hasOnboarded = useAppStore(s => s.hasOnboarded);

  // Try to restore session from refresh token cookie on first load
  useEffect(() => {
    refreshSession().catch(() => {/* no-op — guest play is fine */});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      margin: '0 auto',
      maxWidth: 600,
      minHeight: '100dvh',
      position: 'relative',
      overflowX: 'hidden',
      /* Bottom padding: nav height + safe-area when nav is visible */
      paddingBottom: showNav ? NAV_HEIGHT : 0,
      backgroundColor: '#0F172A',
      boxShadow: '0 0 40px rgba(0,0,0,0.7)',
    }}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Smart root redirect: skip onboarding for returning users */}
          <Route path="/"           element={<Navigate to={hasOnboarded ? '/home' : '/onboarding'} replace />} />
          {/* Auth success always lands on home (onboarding already done) */}
          <Route path="/auth"       element={<AuthPage onSuccess={() => navigate('/home')} />} />
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

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
