// React imported implicitly
import { motion } from 'framer-motion';
import { X, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Paywall() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/home')} style={{ backgroundColor: '#E5E7EB', padding: 8, borderRadius: '50%' }}>
          <X size={24} color="#111827" strokeWidth={3} />
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-light)' }}>CDC Art. 49: Teste 7 dias grátis</span>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div style={{ width: 80, height: 80, backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, boxShadow: '0 4px 0 #F59E0B' }}>
            <Zap size={40} color="#D97706" />
          </div>
          
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111827', marginBottom: 12, lineHeight: 1.1 }}>Seu limite de backlog estourou.</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: 32, lineHeight: 1.5, fontWeight: 600 }}>
            Zerar revisões atrasadas frustra qualquer um. O <strong style={{ color: '#111827', fontWeight: 800 }}>Modo Recuperação (Pro)</strong> redistribui seus flashcards automaticamente sem punir sua Streak.
          </p>

          {/* Pricing Tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {/* Free Tier */}
            <div style={{ border: '2px solid #E5E7EB', borderRadius: 'var(--radius-md)', padding: '16px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-light)' }}>Plano Base (Atual)</h3>
              <ul style={{ marginTop: 12, listStyle: 'none', padding: 0, color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 700 }}>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle2 size={20} color="#9CA3AF" /> Missão Diária Simples</li>
                <li style={{ display: 'flex', gap: 8 }}><CheckCircle2 size={20} color="#9CA3AF" /> Questões Limitadas</li>
              </ul>
            </div>

            {/* Pro Tier - Highlighted */}
            <div style={{ border: '4px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: '20px', backgroundColor: 'white', position: 'relative', boxShadow: 'var(--shadow-float)' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                MAIS ESCOLHIDO
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>Essencial Pro</h3>
                <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>R$ 29<span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>/mês</span></span>
              </div>
              
              <ul style={{ marginTop: 24, listStyle: 'none', padding: 0, color: '#374151', display: 'flex', flexDirection: 'column', gap: 16, fontWeight: 700 }}>
                <li style={{ display: 'flex', gap: 12 }}><CheckCircle2 size={24} color="var(--color-primary)" /> Modo Recuperação de Backlog</li>
                <li style={{ display: 'flex', gap: 12 }}><CheckCircle2 size={24} color="var(--color-primary)" /> Lei Viva com Histórico Completo</li>
                <li style={{ display: 'flex', gap: 12 }}><CheckCircle2 size={24} color="var(--color-primary)" /> Modo Banca Analytics</li>
              </ul>

              <button className="btn-chubby btn-primary" style={{ width: '100%', marginTop: 32, padding: 18 }} onClick={() => navigate('/home')}>
                Testar Grátis por 7 Dias
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 800, paddingBottom: 24 }}>
            <Shield size={20} /> Compra segura. Cancele com 1 clique.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
