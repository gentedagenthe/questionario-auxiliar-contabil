import React from 'react';
import QuestionarioAuxiliarContabil from './QuestionarioAuxiliarContabil';
import AdminPanel from './components/AdminPanel';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

function InscricoesEncerradas() {
  return (
    <div style={{ minHeight: '100vh', background: FUNDO, fontFamily: "'Poppins', sans-serif", padding: '24px 16px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto 20px', background: AZUL, borderBottom: `4px solid ${VERDE}`, borderRadius: '10px', padding: '16px 22px' }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>genthe</div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>que entende de gente</div>
      </div>
      <div style={{ maxWidth: '640px', margin: '0 auto', background: '#fff', borderRadius: '12px', border: `1px solid ${BORDA}`, padding: '28px 26px', textAlign: 'center' }}>
        <div style={{ fontSize: '38px', marginBottom: '10px' }}>📋</div>
        <div style={{ fontSize: '19px', fontWeight: 800, color: AZUL }}>Inscrições encerradas</div>
        <div style={{ fontSize: '13px', color: '#5b6b7a', marginTop: '8px' }}>
          As inscrições para a vaga de Auxiliar Contábil foram encerradas. Agradecemos o seu interesse. Acompanhe novas oportunidades em @gentheconsultoria.
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '26px', fontSize: '12px', color: '#8a97a3' }}>
        contato@genthe.com.br &nbsp;|&nbsp; www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
      </div>
    </div>
  );
}

export default function App() {
  const rota = window.location.pathname;

  if (rota.startsWith('/admin')) {
    return <AdminPanel />;
  }

  if (process.env.REACT_APP_INSCRICOES_ENCERRADAS === 'true') {
    return <InscricoesEncerradas />;
  }

  return <QuestionarioAuxiliarContabil />;
}
