// React imported implicitly
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, BookOpen } from 'lucide-react';

export default function LawViva() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', backgroundColor: 'white', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/home')}><ArrowLeft size={28} color="#111827" /></button>
        <span style={{ marginLeft: 16, fontWeight: 800, fontSize: '1.2rem', color: '#111827' }}>Constituição Federal</span>
      </div>

      <div style={{ padding: '24px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 800 }}>
            Atualizado há 2 dias
          </span>
          <span style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 700 }}>Fonte: Planalto</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginBottom: 24 }}>Art. 5º</h1>

        <div className="font-inter" style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', fontSize: '1.1rem', lineHeight: 1.6, color: '#374151' }}>
          <p style={{ marginBottom: 16 }}>
            Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes:
          </p>
          
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 800 }}>XI - </span> 
            a casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial;
          </div>

          {/* Diff Section Example */}
          <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-sm)', border: '1px solid #E5E7EB', marginBottom: 16, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--color-warning-dark)', fontSize: '0.95rem', fontWeight: 800 }}>
              <AlertTriangle size={20} strokeWidth={3} /> Histórico de Mudança Recente
            </div>
            
            <p style={{ textDecoration: 'line-through', backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '6px', marginBottom: 12 }}>
              LXXIX - (Texto antigo revogado omitido. Ao ver a linha riscada assim, o aluno sabe exatamente que não pode memorizar isso.)
            </p>
            
            <p style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '12px', borderRadius: '6px', fontWeight: 600 }}>
              <span style={{ fontWeight: 800 }}>LXXIX - </span> é assegurado, nos termos da lei, o direito à proteção dos dados pessoais, inclusive nos meios digitais. (Incluído pela EC 115/2022)
            </p>
          </div>
        </div>

        <button 
          className="btn-chubby btn-primary" 
          style={{ width: '100%', marginTop: 24, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}
          onClick={() => navigate('/study')}
        >
          <BookOpen size={24} />
          Treinar 5 Questões deste Artigo
        </button>
      </div>
    </div>
  );
}
