import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, BookOpen } from 'lucide-react';

export default function LawViva() {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#0F172A',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#1E293B',
        borderBottom: '1px solid #334155',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            borderRadius: 10,
            backgroundColor: '#0F172A',
            border: '1px solid #334155',
          }}>
          <ArrowLeft size={22} color="#94A3B8" />
        </button>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>⚖️ Constituição Federal</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Leitura Dinâmica</div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px', flex: 1, overflowY: 'auto' }}>

        {/* Meta badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: '#1E3A5F',
            color: '#93C5FD',
            padding: '5px 12px',
            borderRadius: 999,
            fontSize: '0.78rem',
            fontWeight: 800,
          }}>
            Atualizado há 2 dias
          </span>
          <span style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 700 }}>
            Fonte: Planalto.gov.br
          </span>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 20, color: '#E2E8F0' }}>
          Art. 5º — Direitos e Garantias
        </h1>

        {/* Law text card */}
        <div style={{
          backgroundColor: '#1E293B',
          padding: '20px',
          borderRadius: 16,
          border: '1px solid #334155',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#CBD5E1',
          marginBottom: 16,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          <p style={{ marginBottom: 16, color: '#E2E8F0' }}>
            Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes:
          </p>

          <div style={{
            padding: '14px 16px',
            backgroundColor: '#0F172A',
            borderRadius: 10,
            border: '1px solid #334155',
            marginBottom: 12,
          }}>
            <span style={{ color: '#A78BFA', fontWeight: 800 }}>XI — </span>
            <span>a casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial;</span>
          </div>
        </div>

        {/* Diff / Recent change Section */}
        <div style={{
          padding: '16px',
          backgroundColor: '#1C0A00',
          borderRadius: 14,
          border: '2px solid #78350F',
          marginBottom: 20,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 14,
            color: '#FCD34D',
            fontSize: '0.92rem',
            fontWeight: 800,
          }}>
            <AlertTriangle size={18} strokeWidth={2.5} />
            Mudança Recente — Cai em prova!
          </div>

          {/* Old text */}
          <div style={{
            textDecoration: 'line-through',
            backgroundColor: '#450A0A',
            color: '#FCA5A5',
            padding: '12px',
            borderRadius: 8,
            marginBottom: 10,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            LXXIX — (Texto antigo revogado. A linha riscada sinaliza que não se deve memorizar este conteúdo.)
          </div>

          {/* New text */}
          <div style={{
            backgroundColor: '#052E16',
            color: '#86EFAC',
            padding: '12px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.92rem',
            lineHeight: 1.6,
            border: '1px solid #166534',
          }}>
            <span style={{ fontWeight: 900 }}>LXXIX — </span>
            é assegurado, nos termos da lei, o direito à proteção dos dados pessoais, inclusive nos meios digitais.{' '}
            <span style={{ color: '#4ADE80', fontWeight: 800 }}>(Incluído pela EC 115/2022)</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn-chubby btn-primary"
          style={{
            width: '100%',
            padding: '17px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            fontSize: '1rem',
            fontWeight: 900,
            borderRadius: 14,
            backgroundColor: '#3B82F6',
            color: 'white',
            boxShadow: '0 5px 0 #1D4ED8',
          }}
          onClick={() => navigate('/study')}
        >
          <BookOpen size={22} />
          Treinar 5 Questões deste Artigo
        </button>
      </div>
    </div>
  );
}
