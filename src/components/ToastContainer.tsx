import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '../store/useToastStore';

const TYPE_COLORS = {
  success: { bg: '#16A34A', border: '#22C55E' },
  error:   { bg: '#991B1B', border: '#EF4444' },
  info:    { bg: '#1E40AF', border: '#3B82F6' },
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
      alignItems: 'center', width: '100%', maxWidth: 360, pointerEvents: 'none',
      padding: '0 16px',
    }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const c = TYPE_COLORS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88, y: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              onClick={() => dismiss(toast.id)}
              style={{
                pointerEvents: 'auto',
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                padding: '10px 18px',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: `0 4px 20px ${c.bg}55`,
                cursor: 'pointer', userSelect: 'none',
                width: '100%',
              }}
            >
              {toast.emoji && (
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{toast.emoji}</span>
              )}
              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'white', flex: 1 }}>
                {toast.message}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
