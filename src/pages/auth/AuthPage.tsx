import { useState } from 'react';
import { useAuthStore } from '../../services/authStore';

interface Props {
  onSuccess: () => void;
}

export default function AuthPage({ onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, error, isLoading, clearError } = useAuthStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
      onSuccess();
    } catch (_) { /* error shown via store */ }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #1a0533 0%, #0d1b2a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      fontFamily: "'Nunito', system-ui, sans-serif",
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 56, marginBottom: 12, lineHeight: 1 }}>⚔️</div>
        <h1 style={{ color: '#ffd700', fontSize: '1.4rem', margin: 0, letterSpacing: 2, fontWeight: 900 }}>
          PHANTOM SINGULARITY
        </h1>
        <p style={{ color: '#8888aa', fontSize: '0.85rem', marginTop: 8, fontWeight: 600 }}>
          Estude. Evolua. Passe no concurso.
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid #6a0dad',
        borderRadius: 20,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 0 40px rgba(106,13,173,0.4)',
      }}>
        {/* Toggle login / register */}
        <div style={{
          display: 'flex',
          marginBottom: 24,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #6a0dad',
        }}>
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); clearError(); }}
              style={{
                flex: 1,
                padding: '12px 0',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: 0.5,
                background: mode === m ? '#6a0dad' : 'transparent',
                color: mode === m ? '#fff' : '#8888aa',
                transition: 'all 0.2s',
              }}>
              {m === 'login' ? '🎯 ENTRAR' : '✨ CADASTRAR'}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(255,50,50,0.15)',
            border: '1px solid #ff3232',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 16,
            color: '#ff8888',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            fontWeight: 600,
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <input
              required
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            required
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            required
            type="password"
            placeholder="Senha (mín. 8 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" disabled={isLoading} style={btnStyle('#6a0dad', isLoading)}>
            {isLoading ? '⚡ Carregando...' : mode === 'login' ? '⚔️ ENTRAR' : '✨ CRIAR CONTA'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem', margin: '16px 0', fontWeight: 700 }}>
          — ou —
        </div>

        {/* Guest play */}
        <button onClick={onSuccess} style={btnStyle('#1a3a5c', false)}>
          👻 JOGAR SEM CONTA
        </button>

        <p style={{
          color: '#555',
          fontSize: '0.75rem',
          textAlign: 'center',
          marginTop: 16,
          lineHeight: 1.7,
          fontWeight: 600,
        }}>
          Login com Google disponível em breve.<br />
          Ao criar conta você aceita os termos de uso.
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid #444',
  borderRadius: 10,
  padding: '14px 16px',
  color: '#eee',
  fontFamily: 'inherit',
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

function btnStyle(bg: string, disabled: boolean): React.CSSProperties {
  return {
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '16px 0',
    width: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    fontWeight: 800,
    letterSpacing: 0.5,
    opacity: disabled ? 0.7 : 1,
    transition: 'opacity 0.2s',
  };
}
