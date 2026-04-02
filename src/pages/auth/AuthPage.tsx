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
      minHeight: '100dvh', background: 'linear-gradient(135deg,#1a0533 0%,#0d1b2a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Press Start 2P', monospace",
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>⚔️</div>
        <h1 style={{ color: '#ffd700', fontSize: 14, margin: 0, letterSpacing: 2 }}>
          PHANTOM SINGULARITY
        </h1>
        <p style={{ color: '#8888aa', fontSize: 8, marginTop: 8 }}>
          Estude. Evolua. Passe no concurso.
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '2px solid #6a0dad',
        borderRadius: 16, padding: 28, width: '100%', maxWidth: 380,
        boxShadow: '0 0 40px rgba(106,13,173,0.4)',
      }}>
        {/* Toggle */}
        <div style={{ display: 'flex', marginBottom: 24, borderRadius: 8, overflow: 'hidden', border: '1px solid #6a0dad' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); clearError(); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 8, letterSpacing: 1,
                background: mode === m ? '#6a0dad' : 'transparent',
                color: mode === m ? '#fff' : '#8888aa',
                transition: 'all 0.2s',
              }}>
              {m === 'login' ? '🎯 ENTRAR' : '✨ CADASTRAR'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255,50,50,0.15)', border: '1px solid #ff3232',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            color: '#ff8888', fontSize: 8, lineHeight: 1.6,
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <input
              required placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            required type="password" placeholder="Senha (mín. 8 chars)" value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle}
          />
          <button type="submit" disabled={isLoading} style={btnStyle('#6a0dad')}>
            {isLoading ? '⚡ Carregando...' : mode === 'login' ? '⚔️ ENTRAR' : '✨ CRIAR CONTA'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#555', fontSize: 8, margin: '16px 0' }}>— ou —</div>

        {/* Guest play button (bypass auth) */}
        <button onClick={onSuccess} style={btnStyle('#1a3a5c')}>
          👻 JOGAR SEM CONTA
        </button>

        <p style={{ color: '#444', fontSize: 7, textAlign: 'center', marginTop: 14, lineHeight: 1.8 }}>
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
  borderRadius: 8,
  padding: '12px 14px',
  color: '#eee',
  fontFamily: 'inherit',
  fontSize: 9,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px 0',
    width: '100%',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 9,
    letterSpacing: 1,
    transition: 'opacity 0.2s',
  };
}
