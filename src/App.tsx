import { useEffect, Component, useState } from 'react';
import type { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import HomeLoop from './pages/home/HomeLoop';
import StudySelect from './pages/study/StudySelect';
import StudySwipeMode from './pages/study/StudySwipeMode';
import ItemsPage from './pages/items/ItemsPage';
import LawViva from './pages/law/LawViva';
import AuthPage from './pages/auth/AuthPage';
import SettingsPage from './pages/settings/SettingsPage';
import CosmeticsPage from './pages/cosmetics/CosmeticsPage';
import { useAuthStore } from './services/authStore';
import { useAppStore } from './store/useAppStore';

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    // Animate progress bar 0→100 over ~1.8s
    const start = performance.now();
    const duration = 1800;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase('done');
        setTimeout(onDone, 500); // wait for exit animation
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: '#060B18',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundImage: [
          'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.22) 0%, transparent 55%)',
          'radial-gradient(ellipse at 80% 100%, rgba(124,58,237,0.15) 0%, transparent 45%)',
        ].join(', '),
        userSelect: 'none',
      }}
    >
      {/* Star field */}
      {Array.from({ length: 28 }, (_, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.8 + (i % 5) * 0.6, delay: (i * 0.13) % 2 }}
          style={{
            position: 'absolute',
            left: `${(i * 37 + 11) % 97}%`,
            top: `${(i * 23 + 7) % 90}%`,
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: ['#60A5FA', '#A78BFA', '#E2E8F0'][i % 3],
          }}
        />
      ))}

      {/* Central content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

        {/* Hero logo */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          {/* Outer pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.55, 0.25] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -28, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {/* Inner glow */}
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -8, borderRadius: 36,
              background: 'rgba(59,130,246,0.18)',
              pointerEvents: 'none',
            }}
          />
          {/* Logo box */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
            transition={{
              scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
              opacity: { duration: 0.4 },
              y: { repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.5 },
            }}
            style={{
              width: 100, height: 100, borderRadius: 30,
              background: 'linear-gradient(135deg, #1E3A8A 0%, #312E81 60%, #1E1B4B 100%)',
              border: '2px solid rgba(99,102,241,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem', lineHeight: 1,
              boxShadow: '0 0 50px rgba(59,130,246,0.4), 0 8px 0 rgba(29,78,216,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
            ⚔️
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontWeight: 900, fontSize: '2rem', lineHeight: 1.1, color: 'white',
            letterSpacing: -0.5,
          }}>
            Concurseiro
          </div>
          <div style={{
            fontWeight: 900, fontSize: '2rem', lineHeight: 1.1,
            background: 'linear-gradient(90deg, #60A5FA, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: -0.5,
          }}>
            RPG
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            color: '#334155', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: 1.4, textTransform: 'uppercase', margin: '0 0 40px',
          }}>
          Estude. Lute. Evolua.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: '100%', height: 4, borderRadius: 4,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%', borderRadius: 4,
                background: 'linear-gradient(90deg, #3B82F6, #7C3AED)',
                boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                width: `${progress}%`,
              }}
              transition={{ duration: 0.05 }}
            />
          </div>
          <div style={{
            fontSize: '0.6rem', fontWeight: 800, color: '#1E293B',
            letterSpacing: 1.2, textTransform: 'uppercase',
          }}>
            {phase === 'done' ? '✓ Pronto!' : `Carregando... ${progress}%`}
          </div>
        </motion.div>
      </div>

      {/* Mutum Labs badge — bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          position: 'absolute', bottom: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 14px', borderRadius: 20,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {/* Mutum Labs logo mark */}
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 900, color: 'white',
            boxShadow: '0 2px 6px rgba(59,130,246,0.4)',
          }}>M</div>
          <span style={{
            fontSize: '0.65rem', fontWeight: 800,
            color: '#475569', letterSpacing: 0.8,
          }}>
            MUTUM LABS
          </span>
        </div>
        <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#1E293B', letterSpacing: 0.5 }}>
          v1.0 · Todos os direitos reservados
        </div>
      </motion.div>
    </motion.div>
  );
}

// Pages that show the bottom navigation bar
const NAV_PAGES = ['/home', '/select'];
// Height of bottom nav bar (px) — used to offset CTA buttons above it
export const NAV_HEIGHT = 64;

const NAV_ITEMS = [
  { path: '/home',   icon: '⛺', label: 'Base'    },
  { path: '/select', icon: '📚', label: 'Estudar' },
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
      alignItems: 'stretch',
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

      {/* Settings gear button — right edge of nav */}
      <button
        onClick={() => navigate('/settings')}
        style={{
          width: 50, padding: '10px 0 8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
          borderLeft: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <motion.div
          whileTap={{ rotate: 45 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: 44, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 12,
          }}
        >
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>⚙️</span>
        </motion.div>
        <span style={{
          fontSize: '0.62rem', fontWeight: 800,
          color: '#334155',
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          Config
        </span>
      </button>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const showNav = NAV_PAGES.includes(location.pathname);
  const { refreshSession } = useAuthStore();
  const hasOnboarded = useAppStore(s => s.hasOnboarded);
  const theme = useAppStore(s => s.theme);

  // Try to restore session from refresh token cookie on first load
  useEffect(() => {
    refreshSession().catch(() => {/* no-op — guest play is fine */});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync theme to document for any global CSS that may need it
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
          <Route path="/settings"   element={<SettingsPage />} />
          <Route path="/hero"       element={<CosmeticsPage />} />
        </Routes>
      </AnimatePresence>
      <BottomNavbar />
    </div>
  );
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <div style={{
          minHeight: '100dvh', backgroundColor: '#0A0F1E', color: 'white',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center', gap: 16,
        }}>
          <div style={{ fontSize: '3rem' }}>💥</div>
          <h2 style={{ fontWeight: 900, color: '#EF4444', margin: 0 }}>Algo deu errado</h2>
          <p style={{ color: '#475569', fontSize: '0.85rem', maxWidth: 320 }}>{err.message}</p>
          <button
            onClick={() => {
              localStorage.removeItem('phantom-rpg-v3-save');
              window.location.reload();
            }}
            style={{
              padding: '12px 24px', borderRadius: 12, fontWeight: 800,
              background: 'linear-gradient(135deg,#3B82F6,#6D28D9)',
              color: 'white', fontSize: '0.9rem', cursor: 'pointer', border: 'none',
            }}>
            🔄 Resetar e reiniciar
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{ color: '#334155', fontSize: '0.8rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {!splashDone && <SplashScreen key="splash" onDone={() => setSplashDone(true)} />}
      </AnimatePresence>
      {splashDone && (
        <HashRouter>
          <AppContent />
        </HashRouter>
      )}
    </ErrorBoundary>
  );
}

export default App;
