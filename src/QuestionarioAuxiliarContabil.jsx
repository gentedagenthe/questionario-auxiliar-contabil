import React, { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

const styles = {
  page: {
    minHeight: '100vh',
    background: FUNDO,
    fontFamily: "'Poppins', sans-serif",
    padding: '24px 16px',
  },
  header: {
    maxWidth: '640px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: AZUL,
    borderBottom: `4px solid ${VERDE}`,
    borderRadius: '10px',
    padding: '16px 22px',
  },
  logoText: { color: '#fff', fontWeight: 800, fontSize: '20px' },
  logoSub: { color: 'rgba(255,255,255,0.85)', fontSize: '12px' },
  card: {
    maxWidth: '640px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    border: `1px solid ${BORDA}`,
    padding: '28px 26px',
    boxShadow: '0 2px 10px rgba(27,111,171,0.08)',
  },
  titulo: { fontSize: '19px', fontWeight: 800, color: AZUL, marginBottom: '4px' },
  subtitulo: { fontSize: '13px', color: '#5b6b7a', marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#33404a', margin: '16px 0 6px' },
  input: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  radioGroup: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  radioOpt: (sel) => ({
    padding: '9px 16px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    fontSize: '13px',
    color: sel ? '#256b1f' : '#33404a',
    cursor: 'pointer',
    fontWeight: sel ? 700 : 500,
  }),
  botao: {
    width: '100%',
    marginTop: '24px',
    padding: '13px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  botaoSec: {
    width: '100%',
    marginTop: '10px',
    padding: '13px',
    background: '#fff',
    color: AZUL,
    fontWeight: 700,
    fontSize: '14px',
    border: `1.5px solid ${AZUL}`,
    borderRadius: '8px',
    cursor: 'pointer',
  },
  nav: { display: 'flex', gap: '10px', marginTop: '22px' },
  erro: {
    background: '#fff3f3',
    border: '1px solid #f5c2c2',
    color: '#c0392b',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginTop: '14px',
  },
  lgpd: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '8px',
    padding: '16px 18px',
    fontSize: '12.5px',
    color: '#4a5a68',
    lineHeight: 1.7,
    marginTop: '14px',
  },
  checkLgpd: (sel) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '13px 15px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151',
    marginTop: '18px',
  }),
  progWrap: { display: 'flex', gap: '5px', maxWidth: '640px', margin: '0 auto 14px' },
  progBar: (state) => ({
    flex: 1,
    height: '5px',
    borderRadius: '4px',
    background: state === 'done' ? VERDE : state === 'atual' ? AZUL : BORDA,
  }),
  gridInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    margin: '18px 0 22px',
  },
  infoCard: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '10px',
    padding: '14px 12px',
    textAlign: 'center',
  },
  infoIcon: { fontSize: '20px', marginBottom: '4px' },
  infoLabel: { fontSize: '11px', color: '#6b7a88', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  infoValor: { fontSize: '13px', color: '#1a2733', fontWeight: 700, marginTop: '2px' },
  secaoTitulo: {
    fontSize: '12px',
    fontWeight: 800,
    color: AZUL,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginTop: '20px',
    marginBottom: '8px',
  },
  listaItem: { display: 'flex', gap: '8px', fontSize: '13.5px', color: '#3d4a56', padding: '4px 0', lineHeight: 1.5 },
  checkIcon: { color: VERDE, fontWeight: 800 },
  botaoCandidatar: {
    width: '100%',
    marginTop: '22px',
    padding: '14px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14.5px',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
  },
};

const ETAPAS = [
  { id: 'lgpd', titulo: '', sub: '' },
  { id: 'dados', titulo: 'Dados Pessoais', sub: 'Preencha seus dados de identificação e contato.' },
  { id: 'situacao', titulo: 'Situação Profissional Atual', sub: 'Conte sua situação atual e disponibilidade.' },
  { id: 'formacao', titulo: 'Formação Acadêmica', sub: 'Informações sobre o curso de Ciências Contábeis.' },
  { id: 'tecnico', titulo: 'Conhecimentos Contábeis', sub: 'Sua base em rotinas contábeis, lançamentos, conciliações e ferramentas.' },
  { id: 'habilidades', titulo: 'Perfil e Habilidades', sub: 'Como você atua na rotina de trabalho e com a equipe.' },
  { id: 'motivacao', titulo: 'Motivação e Expectativas', sub: 'O que te move e o que espera desta oportunidade.' },
  { id: 'disponibilidade', titulo: 'Disponibilidade e Deslocamento', sub: 'Informações sobre jornada de trabalho e locomoção.' },
  { id: 'fim', titulo: '', sub: '' },
];

const inicial = {
  // Dados Pessoais
  nome: '', cpf: '', email: '', telefone: '', cidade_atual: '', bairro: '', com_quem_mora: '',
  // Situação Profissional
  situacao_profissional: '', empresa_atual: '', cargo_atual: '', disponibilidade_inicio: '',
  // Formação Acadêmica
  cursando_contabeis: '', instituicao_ensino: '', semestre_atual: '', turno_curso: '',
  // Conhecimentos Contábeis
  experiencia_contabil: '', nivel_rotinas_plano_contas: '', nivel_debito_credito_conciliacao: '',
  nivel_excel: '', vivencia_sistemas: '', sistemas_utilizados: '',
  caso_lancamento: '', caso_conciliacao: '', recursos_excel: '',
  // Perfil e Habilidades
  atencao_detalhes: '', organizacao_prazos: '', rotinas_repetitivas: '',
  disposicao_aprender: '', comunicacao_equipe: '',
  // Motivação e Expectativas
  motivacao_vaga: '', objetivo_carreira: '', concorda_remuneracao: '',
  // Disponibilidade e Deslocamento
  compatibilidade_horario: '', meio_deslocamento: '',
  // LGPD
  lgpd_aceite: false,
};

const NIVEIS = ['Nenhum', 'Básico', 'Intermediário', 'Avançado'];

// ---------- Campos definidos FORA do componente para evitar perda de foco ----------

const CampoTexto = React.memo(function CampoTexto({ label, valor, campo, onChange, placeholder, tipo = 'text' }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <input
        style={styles.input}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoTextArea = React.memo(function CampoTextArea({ label, valor, campo, onChange, placeholder, linhas = 3 }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <textarea
        style={styles.textarea}
        rows={linhas}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoRadio = React.memo(function CampoRadio({ label, valor, campo, onChange, opcoes }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <div style={styles.radioGroup}>
        {opcoes.map((op) => (
          <div
            key={op}
            style={styles.radioOpt(valor === op)}
            onClick={() => onChange(campo, op)}
          >
            {op}
          </div>
        ))}
      </div>
    </>
  );
});

const Lista = ({ itens }) => (
  <div>
    {itens.map((t) => (
      <div key={t} style={styles.listaItem}><span style={styles.checkIcon}>✓</span> {t}</div>
    ))}
  </div>
);

const Cabecalho = () => (
  <div style={styles.header}>
    <div>
      <div style={styles.logoText}>genthe</div>
      <div style={styles.logoSub}>que entende de gente</div>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', textAlign: 'right' }}>
      Processo Seletivo<br />
      <strong style={{ color: '#fff' }}>Auxiliar Contábil | Escritório de Contabilidade</strong>
    </div>
  </div>
);

const Rodape = () => (
  <div style={{ textAlign: 'center', marginTop: '26px', fontSize: '12px', color: '#8a97a3' }}>
    contato@genthe.com.br &nbsp;|&nbsp; www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
  </div>
);

export default function QuestionarioAuxiliarContabil() {
  const [tela, setTela] = useState('vaga');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const set = useCallback((campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  }, []);

  const validar = useCallback(() => {
    if (etapa === 1) {
      if (!form.nome.trim()) return 'Informe o nome completo.';
      if (!form.cpf.trim()) return 'Informe o CPF.';
      if (!form.email.trim()) return 'Informe o e-mail.';
      if (!form.telefone.trim()) return 'Informe o telefone.';
      if (!form.cidade_atual.trim()) return 'Informe a cidade onde reside atualmente.';
      if (!form.bairro.trim()) return 'Informe o bairro onde reside.';
      if (!form.com_quem_mora) return 'Informe com quem mora atualmente.';
    }
    if (etapa === 2) {
      if (!form.situacao_profissional) return 'Informe a situação profissional atual.';
      if (!form.empresa_atual.trim()) return 'Informe a empresa atual ou a mais recente.';
      if (!form.cargo_atual.trim()) return 'Informe o cargo atual ou o mais recente.';
      if (!form.disponibilidade_inicio) return 'Informe a disponibilidade para início.';
    }
    if (etapa === 3) {
      if (!form.cursando_contabeis) return 'Informe se está cursando Ciências Contábeis.';
      if (form.cursando_contabeis !== 'Não' && !form.instituicao_ensino.trim()) return 'Informe a instituição de ensino.';
      if (form.cursando_contabeis === 'Sim' && !form.semestre_atual) return 'Informe o semestre atual.';
      if (form.cursando_contabeis === 'Sim' && !form.turno_curso) return 'Informe o turno do curso.';
    }
    if (etapa === 4) {
      if (!form.experiencia_contabil.trim()) return 'Descreva sua experiência na área contábil.';
      if (!form.nivel_rotinas_plano_contas) return 'Informe seu nível em rotinas contábeis e plano de contas.';
      if (!form.nivel_debito_credito_conciliacao) return 'Informe seu nível em débito, crédito e conciliação de contas.';
      if (!form.nivel_excel) return 'Informe seu nível em Excel.';
      if (!form.vivencia_sistemas) return 'Informe se possui vivência com sistemas contábeis.';
      if (form.vivencia_sistemas === 'Sim' && !form.sistemas_utilizados.trim()) return 'Informe quais sistemas contábeis já utilizou.';
      if (!form.caso_lancamento.trim()) return 'Responda como registraria o lançamento contábil.';
      if (!form.caso_conciliacao.trim()) return 'Responda como localizaria a diferença na conciliação bancária.';
      if (!form.recursos_excel.trim()) return 'Informe os recursos do Excel que utiliza.';
    }
    if (etapa === 5) {
      if (!form.atencao_detalhes.trim()) return 'Descreva uma situação em que identificou um erro.';
      if (!form.organizacao_prazos.trim()) return 'Descreva como organiza suas tarefas para cumprir prazos.';
      if (!form.rotinas_repetitivas.trim()) return 'Descreva como mantém a precisão em rotinas repetitivas.';
      if (!form.disposicao_aprender.trim()) return 'Conte algo que aprendeu por iniciativa própria.';
      if (!form.comunicacao_equipe.trim()) return 'Descreva como age diante de uma dúvida de classificação.';
    }
    if (etapa === 6) {
      if (!form.motivacao_vaga.trim()) return 'Informe o que te motivou a se candidatar.';
      if (!form.objetivo_carreira.trim()) return 'Informe seu objetivo na área contábil.';
      if (!form.concorda_remuneracao) return 'Informe se a remuneração está de acordo com a sua expectativa.';
    }
    if (etapa === 7) {
      if (!form.compatibilidade_horario) return 'Informe a disponibilidade para cumprir a jornada de trabalho.';
      if (!form.meio_deslocamento) return 'Informe o meio de deslocamento até o trabalho.';
    }
    return '';
  }, [etapa, form]);

  const avancarLgpd = useCallback(() => {
    if (!lgpdAceite) { setLgpdErro(true); return; }
    setForm((f) => ({ ...f, lgpd_aceite: true }));
    setTela('form');
    window.scrollTo(0, 0);
  }, [lgpdAceite]);

  const enviar = useCallback(async () => {
    setEnviando(true);
    setErro('');
    try {
      const { error } = await supabase.from('candidatos_auxiliar_contabil').insert([{ ...form }]);
      if (error) throw error;
      setTela('fim');
      window.scrollTo(0, 0);
    } catch (e) {
      setErro('Ocorreu um erro ao enviar. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }, [form]);

  const avancar = useCallback(() => {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro('');
    if (etapa < ETAPAS.length - 2) {
      setEtapa((e) => e + 1);
      window.scrollTo(0, 0);
    } else {
      enviar();
    }
  }, [etapa, validar, enviar]);

  const voltar = useCallback(() => {
    if (etapa > 1) { setEtapa((e) => e - 1); setErro(''); window.scrollTo(0, 0); }
  }, [etapa]);

  const progresso = () => {
    const total = ETAPAS.length - 2;
    const atualIdx = etapa - 1;
    return (
      <div style={styles.progWrap}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={styles.progBar(i < atualIdx ? 'done' : i === atualIdx ? 'atual' : 'pendente')} />
        ))}
      </div>
    );
  };

  // ---------- Tela da Vaga ----------
  if (tela === 'vaga') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={styles.titulo}>Auxiliar Contábil</div>
          <div style={styles.subtitulo}>Escritório de Contabilidade · Departamento Contábil · Campo Grande/MS</div>

          <div style={styles.gridInfo}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💰</div>
              <div style={styles.infoLabel}>Salário</div>
              <div style={styles.infoValor}>R$ 1.800,00 bruto</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🕗</div>
              <div style={styles.infoLabel}>Horário</div>
              <div style={styles.infoValor}>Seg a Sex · 07:30 às 18:00</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📍</div>
              <div style={styles.infoLabel}>Cidade</div>
              <div style={styles.infoValor}>Campo Grande/MS</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📄</div>
              <div style={styles.infoLabel}>Contratação</div>
              <div style={styles.infoValor}>CLT</div>
            </div>
          </div>

          <div style={styles.secaoTitulo}>🎁 Benefícios</div>
          <Lista itens={['Vale Alimentação de R$ 300,00 por mês']} />

          <div style={styles.secaoTitulo}>📚 Saber</div>
          <Lista itens={[
            'Cursando Ciências Contábeis, a partir do 3º semestre',
            'Conhecimento básico em rotinas contábeis e plano de contas',
            'Noções de débito, crédito e conciliação de contas',
            'Conhecimento em Pacote Office, especialmente Excel',
            'Desejável vivência com sistemas contábeis',
          ]} />

          <div style={styles.secaoTitulo}>🧠 Habilidades</div>
          <Lista itens={[
            'Atenção aos detalhes e precisão nos registros',
            'Organização e cumprimento de prazos',
            'Facilidade com números e rotinas repetitivas',
            'Disposição para aprender e crescer na área contábil',
            'Boa comunicação e trabalho em equipe',
          ]} />

          <div style={styles.secaoTitulo}>🛠️ Principais Atividades</div>
          <Lista itens={[
            'Realizar lançamentos contábeis no sistema',
            'Classificar documentos conforme o plano de contas',
            'Conferir e organizar documentos fiscais e financeiros das empresas clientes',
            'Auxiliar nas conciliações bancárias e contábeis',
            'Apoiar a análise de contas e a conferência de saldos',
            'Arquivar e controlar documentos físicos e digitais',
            'Apoiar a equipe no fechamento contábil mensal',
          ]} />

          <button style={styles.botaoCandidatar} onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
            Candidate-se agora →
          </button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela LGPD ----------
  if (tela === 'lgpd') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔒</div>
          <div style={styles.titulo}>Proteção de Dados | LGPD</div>
          <div style={styles.lgpd}>
            As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de recrutamento e seleção pela <strong>Genthe Consultoria em Gestão de Pessoas</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, LGPD)</strong>.<br /><br />
            Seus dados serão tratados com segurança, sigilo e responsabilidade, podendo ser compartilhados com a empresa contratante vinculada a este processo seletivo. Ao prosseguir, você também autoriza a realização de verificação de antecedentes junto a órgãos públicos, utilizando CPF e nome completo, como parte da etapa de triagem.<br /><br />
            Você poderá solicitar a correção, a atualização ou a exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>. Ao continuar, você declara ter lido e concordado com o tratamento dos seus dados pessoais para participação neste processo seletivo, nos termos da LGPD.
          </div>
          <div style={styles.checkLgpd(lgpdAceite)} onClick={() => { setLgpdAceite((v) => !v); setLgpdErro(false); }}>
            <span style={{ fontSize: '16px' }}>{lgpdAceite ? '✅' : '⬜'}</span>
            Li e concordo com o tratamento dos meus dados pessoais, incluindo a verificação de antecedentes, para participação neste processo seletivo, conforme a LGPD.
          </div>
          {lgpdErro && <div style={styles.erro}>É necessário concordar com os termos para continuar.</div>}
          <button style={styles.botao} onClick={avancarLgpd}>Iniciar questionário →</button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela final ----------
  if (tela === 'fim') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '38px', marginBottom: '10px' }}>✅</div>
          <div style={styles.titulo}>Questionário enviado com sucesso!</div>
          <div style={{ fontSize: '13px', color: '#5b6b7a', marginTop: '8px' }}>
            Obrigada pela sua participação no processo seletivo. Nossa equipe analisará suas respostas e entrará em contato em breve.
          </div>
        </div>
        <Rodape />
      </div>
    );
  }

  const e = ETAPAS[etapa];

  return (
    <div style={styles.page}>
      <Cabecalho />
      {progresso()}
      <div style={styles.card}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: VERDE, letterSpacing: '0.5px' }}>
          ETAPA {etapa} DE {ETAPAS.length - 2}
        </div>
        <div style={styles.titulo}>{e.titulo}</div>
        <div style={styles.subtitulo}>{e.sub}</div>

        {e.id === 'dados' && (
          <>
            <CampoTexto label="Nome completo" campo="nome" valor={form.nome} onChange={set} placeholder="Seu nome completo" />
            <CampoTexto label="CPF" campo="cpf" valor={form.cpf} onChange={set} placeholder="000.000.000-00" />
            <CampoTexto label="E-mail" campo="email" valor={form.email} onChange={set} placeholder="seuemail@exemplo.com" tipo="email" />
            <CampoTexto label="Telefone (WhatsApp)" campo="telefone" valor={form.telefone} onChange={set} placeholder="(67) 90000-0000" />
            <CampoTexto label="Cidade onde reside atualmente" campo="cidade_atual" valor={form.cidade_atual} onChange={set} placeholder="Sua cidade" />
            <CampoTexto label="Bairro onde reside" campo="bairro" valor={form.bairro} onChange={set} placeholder="Seu bairro" />
            <CampoRadio
              label="Com quem mora atualmente"
              campo="com_quem_mora"
              valor={form.com_quem_mora}
              onChange={set}
              opcoes={['Sozinho(a)', 'Cônjuge/Companheiro(a)', 'Pais ou responsáveis', 'Outros familiares', 'Outros']}
            />
          </>
        )}

        {e.id === 'situacao' && (
          <>
            <CampoRadio
              label="Situação profissional atual"
              campo="situacao_profissional"
              valor={form.situacao_profissional}
              onChange={set}
              opcoes={['Empregado(a)', 'Estagiando', 'Disponível no mercado', 'Em busca do primeiro emprego']}
            />
            <CampoTexto label="Empresa atual ou mais recente (se não houver, escreva Primeiro emprego)" campo="empresa_atual" valor={form.empresa_atual} onChange={set} placeholder="Nome da empresa" />
            <CampoTexto label="Cargo atual ou mais recente (se não houver, escreva Primeiro emprego)" campo="cargo_atual" valor={form.cargo_atual} onChange={set} placeholder="Seu cargo" />
            <CampoRadio
              label="Disponibilidade para início"
              campo="disponibilidade_inicio"
              valor={form.disponibilidade_inicio}
              onChange={set}
              opcoes={['Imediata', 'Até 15 dias', 'Até 30 dias', 'Acima de 30 dias']}
            />
          </>
        )}

        {e.id === 'formacao' && (
          <>
            <CampoRadio
              label="Você está cursando Ciências Contábeis"
              campo="cursando_contabeis"
              valor={form.cursando_contabeis}
              onChange={set}
              opcoes={['Sim', 'Não', 'Já concluí o curso']}
            />
            {form.cursando_contabeis !== '' && form.cursando_contabeis !== 'Não' && (
              <CampoTexto label="Instituição de ensino" campo="instituicao_ensino" valor={form.instituicao_ensino} onChange={set} placeholder="Nome da faculdade ou universidade" />
            )}
            {form.cursando_contabeis === 'Sim' && (
              <>
                <CampoRadio
                  label="Semestre atual"
                  campo="semestre_atual"
                  valor={form.semestre_atual}
                  onChange={set}
                  opcoes={['1º ou 2º', '3º', '4º', '5º', '6º', '7º', '8º']}
                />
                <CampoRadio
                  label="Turno do curso"
                  campo="turno_curso"
                  valor={form.turno_curso}
                  onChange={set}
                  opcoes={['Matutino', 'Vespertino', 'Noturno', 'Integral', 'EAD']}
                />
              </>
            )}
          </>
        )}

        {e.id === 'tecnico' && (
          <>
            <CampoTextArea
              label="Descreva sua experiência na área contábil, incluindo estágios, trabalhos anteriores ou atividades práticas do curso"
              campo="experiencia_contabil"
              valor={form.experiencia_contabil}
              onChange={set}
              placeholder="Conte onde atuou, por quanto tempo e quais atividades realizava"
            />
            <CampoRadio
              label="Seu nível de conhecimento em rotinas contábeis e plano de contas"
              campo="nivel_rotinas_plano_contas"
              valor={form.nivel_rotinas_plano_contas}
              onChange={set}
              opcoes={NIVEIS}
            />
            <CampoRadio
              label="Seu nível de conhecimento em débito, crédito e conciliação de contas"
              campo="nivel_debito_credito_conciliacao"
              valor={form.nivel_debito_credito_conciliacao}
              onChange={set}
              opcoes={NIVEIS}
            />
            <CampoRadio
              label="Seu nível de conhecimento em Excel"
              campo="nivel_excel"
              valor={form.nivel_excel}
              onChange={set}
              opcoes={NIVEIS}
            />
            <CampoRadio
              label="Você possui vivência com sistemas contábeis"
              campo="vivencia_sistemas"
              valor={form.vivencia_sistemas}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.vivencia_sistemas === 'Sim' && (
              <CampoTexto label="Quais sistemas contábeis você já utilizou" campo="sistemas_utilizados" valor={form.sistemas_utilizados} onChange={set} placeholder="Exemplo: Domínio, Alterdata, Questor, Contmatic" />
            )}
            <CampoTextArea
              label="Uma empresa cliente pagou, por transferência bancária, uma conta de energia elétrica de R$ 500,00. Como você registraria esse lançamento, indicando a conta de débito e a conta de crédito"
              campo="caso_lancamento"
              valor={form.caso_lancamento}
              onChange={set}
              placeholder="Descreva o lançamento com suas palavras"
            />
            <CampoTextArea
              label="Na conciliação bancária, o saldo do extrato não confere com o saldo contábil da conta Banco. Quais passos você seguiria para localizar a diferença"
              campo="caso_conciliacao"
              valor={form.caso_conciliacao}
              onChange={set}
              placeholder="Descreva o passo a passo"
            />
            <CampoTextArea
              label="Quais recursos do Excel você utiliza no dia a dia"
              campo="recursos_excel"
              valor={form.recursos_excel}
              onChange={set}
              placeholder="Exemplo: fórmulas, PROCV, filtros, tabela dinâmica, formatação condicional"
              linhas={2}
            />
          </>
        )}

        {e.id === 'habilidades' && (
          <>
            <CampoTextArea
              label="Descreva uma situação em que você identificou um erro em um documento, valor ou registro antes que ele causasse problema. Como percebeu e o que fez"
              campo="atencao_detalhes"
              valor={form.atencao_detalhes}
              onChange={set}
              placeholder="Conte o contexto, a ação e o resultado"
            />
            <CampoTextArea
              label="No fechamento contábil mensal, vários clientes têm prazos no mesmo período. Como você organiza suas tarefas para cumprir todos os prazos sem perder a qualidade"
              campo="organizacao_prazos"
              valor={form.organizacao_prazos}
              onChange={set}
              placeholder="Descreva seu método de organização"
            />
            <CampoTextArea
              label="Grande parte da rotina envolve lançamentos e conferências repetitivas. Como você mantém a precisão e a concentração em atividades desse tipo"
              campo="rotinas_repetitivas"
              valor={form.rotinas_repetitivas}
              onChange={set}
              placeholder="Descreva sua forma de trabalhar"
            />
            <CampoTextArea
              label="Conte algo da área contábil ou de ferramentas de trabalho que você aprendeu recentemente por iniciativa própria. Como foi esse aprendizado"
              campo="disposicao_aprender"
              valor={form.disposicao_aprender}
              onChange={set}
              placeholder="Conte o que aprendeu e como aplicou"
            />
            <CampoTextArea
              label="Você recebe um documento de uma empresa cliente e não tem certeza de como classificá-lo no plano de contas. Como você age"
              campo="comunicacao_equipe"
              valor={form.comunicacao_equipe}
              onChange={set}
              placeholder="Descreva sua conduta com a equipe"
            />
          </>
        )}

        {e.id === 'motivacao' && (
          <>
            <CampoTextArea
              label="O que te motivou a se candidatar a esta vaga"
              campo="motivacao_vaga"
              valor={form.motivacao_vaga}
              onChange={set}
              placeholder="Seja objetivo"
            />
            <CampoTextArea
              label="Onde você pretende estar na área contábil nos próximos dois anos"
              campo="objetivo_carreira"
              valor={form.objetivo_carreira}
              onChange={set}
              placeholder="Descreva seus objetivos profissionais"
            />
            <CampoRadio
              label="A remuneração de R$ 1.800,00 bruto, com Vale Alimentação de R$ 300,00 por mês, está de acordo com a sua expectativa"
              campo="concorda_remuneracao"
              valor={form.concorda_remuneracao}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
          </>
        )}

        {e.id === 'disponibilidade' && (
          <>
            <div style={styles.lgpd}>
              A jornada de trabalho é presencial, em Campo Grande/MS, de segunda a sexta, das 07:30 às 18:00.
            </div>
            <CampoRadio
              label="Você tem disponibilidade para cumprir essa jornada, de forma compatível com o horário das suas aulas"
              campo="compatibilidade_horario"
              valor={form.compatibilidade_horario}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            <CampoRadio
              label="Como você se deslocaria até o local de trabalho"
              campo="meio_deslocamento"
              valor={form.meio_deslocamento}
              onChange={set}
              opcoes={['Veículo próprio', 'Transporte coletivo', 'Carona ou aplicativo', 'Bicicleta ou a pé']}
            />
          </>
        )}

        {erro && <div style={styles.erro}>{erro}</div>}

        <div style={styles.nav}>
          {etapa > 1 && <button style={styles.botaoSec} onClick={voltar}>← Voltar</button>}
          <button style={styles.botao} onClick={avancar} disabled={enviando}>
            {etapa === ETAPAS.length - 2 ? (enviando ? 'Enviando...' : '✅ Enviar questionário') : 'Continuar →'}
          </button>
        </div>
      </div>
      <Rodape />
    </div>
  );
}
