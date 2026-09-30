import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

const styles = {
  page: { minHeight: '100vh', background: FUNDO, fontFamily: "'Poppins', sans-serif", padding: '24px 16px' },
  loginWrap: {
    maxWidth: '380px', margin: '90px auto', background: '#fff', borderRadius: '14px',
    padding: '38px 30px', boxShadow: '0 2px 20px rgba(27,111,171,0.1)', textAlign: 'center',
  },
  logo: { fontWeight: 800, fontSize: '22px', color: AZUL },
  sub: { fontSize: '12px', color: '#8a97a3', letterSpacing: '1px', marginBottom: '22px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px 14px', border: `1.5px solid ${BORDA}`, borderRadius: '8px', fontSize: '14px', marginBottom: '10px', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box' },
  botao: { width: '100%', padding: '12px', background: AZUL, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  erro: { color: '#c0392b', fontSize: '12.5px', marginBottom: '10px' },
  header: { maxWidth: '1100px', margin: '0 auto 20px', background: AZUL, borderRadius: '10px', padding: '18px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  filtros: { maxWidth: '1100px', margin: '0 auto 16px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
  filtroInput: { flex: '1 1 220px', padding: '10px 13px', border: `1.5px solid ${BORDA}`, borderRadius: '8px', fontSize: '13px', fontFamily: "'Poppins', sans-serif" },
  lista: { maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  linha: { background: '#fff', border: `1px solid ${BORDA}`, borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', cursor: 'pointer' },
  nome: { fontWeight: 700, color: '#1a2733', fontSize: '14px' },
  detalhe: { fontSize: '12.5px', color: '#6b7a88' },
  badge: { background: FUNDO, border: `1px solid ${BORDA}`, borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', color: AZUL, fontWeight: 600 },
  botaoWpp: { background: VERDE, color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' },
  modalFundo: { position: 'fixed', inset: 0, background: 'rgba(20,30,40,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto', zIndex: 50 },
  modal: { background: '#fff', borderRadius: '12px', maxWidth: '680px', width: '100%', padding: '26px 28px' },
  secao: { fontSize: '12px', fontWeight: 800, color: AZUL, textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '22px', paddingBottom: '4px', borderBottom: `2px solid ${VERDE}` },
  campoLabel: { fontSize: '11.5px', fontWeight: 700, color: '#8a97a3', textTransform: 'uppercase', marginTop: '14px' },
  campoValor: { fontSize: '13.5px', color: '#1a2733', marginTop: '3px', lineHeight: 1.5, whiteSpace: 'pre-wrap' },
  fechar: { float: 'right', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8a97a3' },
};

const Campo = ({ label, valor }) => (
  <>
    <div style={styles.campoLabel}>{label}</div>
    <div style={styles.campoValor}>{valor || 'Não informado'}</div>
  </>
);

const Secao = ({ titulo }) => <div style={styles.secao}>{titulo}</div>;

const fmtData = (d) => (d ? new Date(d).toLocaleString('pt-BR') : 'Não informado');

const formacaoResumo = (c) => {
  if (c.cursando_contabeis === 'Sim') return `${c.semestre_atual} semestre · ${c.turno_curso}`;
  if (c.cursando_contabeis === 'Já concluí o curso') return 'Curso concluído';
  return 'Não cursa Ciências Contábeis';
};

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');
  const [selecionado, setSelecionado] = useState(null);

  const login = () => {
    if (senha === process.env.REACT_APP_ADMIN_PASSWORD) {
      setAutenticado(true);
      setErroLogin('');
    } else {
      setErroLogin('Senha incorreta.');
    }
  };

  useEffect(() => {
    if (!autenticado) return;
    const carregar = async () => {
      setCarregando(true);
      const { data } = await supabase
        .from('candidatos_auxiliar_contabil')
        .select('*')
        .order('criado_em', { ascending: false });
      if (data) setCandidatos(data);
      setCarregando(false);
    };
    carregar();
  }, [autenticado]);

  const filtrados = candidatos.filter((c) => {
    const texto = busca.toLowerCase();
    const nomeOk = !busca || (c.nome || '').toLowerCase().includes(texto) || (c.email || '').toLowerCase().includes(texto);
    const cursoOk = !filtroCurso || c.cursando_contabeis === filtroCurso;
    return nomeOk && cursoOk;
  });

  const copiarWpp = (c) => {
    const txt = `*Genthe | Auxiliar Contábil*\n\n*Candidato(a):* ${c.nome}\n*CPF:* ${c.cpf}\n*E-mail:* ${c.email}\n*Telefone:* ${c.telefone}\n*Cidade/Bairro:* ${c.cidade_atual}, ${c.bairro}\n*Ciências Contábeis:* ${formacaoResumo(c)}\n*Instituição:* ${c.instituicao_ensino || 'Não informado'}\n*Sistemas contábeis:* ${c.vivencia_sistemas}${c.sistemas_utilizados ? ' (' + c.sistemas_utilizados + ')' : ''}\n*Excel:* ${c.nivel_excel}\n*Jornada compatível:* ${c.compatibilidade_horario}\n*De acordo com a remuneração:* ${c.concorda_remuneracao}\n*Disponibilidade para início:* ${c.disponibilidade_inicio}\n*Enviado em:* ${fmtData(c.criado_em)}`;
    navigator.clipboard.writeText(txt);
    alert('Copiado para a área de transferência!');
  };

  if (!autenticado) {
    return (
      <div style={styles.page}>
        <div style={styles.loginWrap}>
          <div style={styles.logo}>genthe</div>
          <div style={styles.sub}>painel administrativo</div>
          {erroLogin && <div style={styles.erro}>{erroLogin}</div>}
          <input
            style={styles.input}
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button style={styles.botao} onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px' }}>Auxiliar Contábil | Candidatos</div>
          <div style={{ fontSize: '12.5px', opacity: 0.85 }}>{candidatos.length} respostas recebidas</div>
        </div>
      </div>

      <div style={styles.filtros}>
        <input
          style={styles.filtroInput}
          placeholder="Buscar por nome ou e-mail"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select style={styles.filtroInput} value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
          <option value="">Todas as situações de curso</option>
          <option value="Sim">Cursando Ciências Contábeis</option>
          <option value="Já concluí o curso">Curso concluído</option>
          <option value="Não">Não cursa Ciências Contábeis</option>
        </select>
      </div>

      <div style={styles.lista}>
        {carregando && <div style={styles.detalhe}>Carregando...</div>}
        {!carregando && filtrados.length === 0 && <div style={styles.detalhe}>Nenhum candidato encontrado.</div>}
        {filtrados.map((c) => (
          <div key={c.id} style={styles.linha} onClick={() => setSelecionado(c)}>
            <div>
              <div style={styles.nome}>{c.nome}</div>
              <div style={styles.detalhe}>{c.email} · {c.telefone}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={styles.badge}>{formacaoResumo(c)}</span>
              <span style={styles.detalhe}>{fmtData(c.criado_em)}</span>
              <button style={styles.botaoWpp} onClick={(e) => { e.stopPropagation(); copiarWpp(c); }}>Copiar WhatsApp</button>
            </div>
          </div>
        ))}
      </div>

      {selecionado && (
        <div style={styles.modalFundo} onClick={() => setSelecionado(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.fechar} onClick={() => setSelecionado(null)}>×</button>
            <div style={{ fontWeight: 800, fontSize: '17px', color: AZUL }}>{selecionado.nome}</div>
            <div style={styles.detalhe}>Enviado em {fmtData(selecionado.criado_em)}</div>

            <Secao titulo="Dados Pessoais" />
            <Campo label="CPF" valor={selecionado.cpf} />
            <Campo label="E-mail" valor={selecionado.email} />
            <Campo label="Telefone" valor={selecionado.telefone} />
            <Campo label="Cidade / Bairro" valor={`${selecionado.cidade_atual}, ${selecionado.bairro}`} />
            <Campo label="Com quem mora atualmente" valor={selecionado.com_quem_mora} />

            <Secao titulo="Situação Profissional" />
            <Campo label="Situação profissional" valor={selecionado.situacao_profissional} />
            <Campo label="Empresa atual" valor={selecionado.empresa_atual} />
            <Campo label="Cargo atual" valor={selecionado.cargo_atual} />
            <Campo label="Disponibilidade para início" valor={selecionado.disponibilidade_inicio} />

            <Secao titulo="Formação Acadêmica" />
            <Campo label="Cursando Ciências Contábeis" valor={selecionado.cursando_contabeis} />
            <Campo label="Instituição de ensino" valor={selecionado.instituicao_ensino} />
            <Campo label="Semestre atual" valor={selecionado.semestre_atual} />
            <Campo label="Turno do curso" valor={selecionado.turno_curso} />

            <Secao titulo="Conhecimentos Contábeis" />
            <Campo label="Experiência na área contábil" valor={selecionado.experiencia_contabil} />
            <Campo label="Rotinas contábeis e plano de contas" valor={selecionado.nivel_rotinas_plano_contas} />
            <Campo label="Débito, crédito e conciliação" valor={selecionado.nivel_debito_credito_conciliacao} />
            <Campo label="Excel" valor={selecionado.nivel_excel} />
            <Campo label="Vivência com sistemas contábeis" valor={`${selecionado.vivencia_sistemas}${selecionado.sistemas_utilizados ? ': ' + selecionado.sistemas_utilizados : ''}`} />
            <Campo label="Caso prático: lançamento da conta de energia" valor={selecionado.caso_lancamento} />
            <Campo label="Caso prático: diferença na conciliação bancária" valor={selecionado.caso_conciliacao} />
            <Campo label="Recursos do Excel utilizados" valor={selecionado.recursos_excel} />

            <Secao titulo="Perfil e Habilidades" />
            <Campo label="Atenção aos detalhes" valor={selecionado.atencao_detalhes} />
            <Campo label="Organização e cumprimento de prazos" valor={selecionado.organizacao_prazos} />
            <Campo label="Precisão em rotinas repetitivas" valor={selecionado.rotinas_repetitivas} />
            <Campo label="Disposição para aprender" valor={selecionado.disposicao_aprender} />
            <Campo label="Comunicação e trabalho em equipe" valor={selecionado.comunicacao_equipe} />

            <Secao titulo="Motivação e Expectativas" />
            <Campo label="Motivação para a vaga" valor={selecionado.motivacao_vaga} />
            <Campo label="Objetivo na área contábil" valor={selecionado.objetivo_carreira} />
            <Campo label="De acordo com a remuneração" valor={selecionado.concorda_remuneracao} />

            <Secao titulo="Disponibilidade e Deslocamento" />
            <Campo label="Jornada compatível com as aulas" valor={selecionado.compatibilidade_horario} />
            <Campo label="Meio de deslocamento" valor={selecionado.meio_deslocamento} />
          </div>
        </div>
      )}
    </div>
  );
}
