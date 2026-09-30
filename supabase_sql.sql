create table candidatos_auxiliar_contabil (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamp with time zone default now(),

  -- Dados Pessoais
  nome text not null,
  cpf text not null,
  email text not null,
  telefone text not null,
  cidade_atual text not null,
  bairro text not null,
  com_quem_mora text not null,

  -- Situação Profissional
  situacao_profissional text not null,
  empresa_atual text not null,
  cargo_atual text not null,
  disponibilidade_inicio text not null,

  -- Formação Acadêmica
  cursando_contabeis text not null,
  instituicao_ensino text,
  semestre_atual text,
  turno_curso text,

  -- Conhecimentos Contábeis
  experiencia_contabil text not null,
  nivel_rotinas_plano_contas text not null,
  nivel_debito_credito_conciliacao text not null,
  nivel_excel text not null,
  vivencia_sistemas text not null,
  sistemas_utilizados text,
  caso_lancamento text not null,
  caso_conciliacao text not null,
  recursos_excel text not null,

  -- Perfil e Habilidades
  atencao_detalhes text not null,
  organizacao_prazos text not null,
  rotinas_repetitivas text not null,
  disposicao_aprender text not null,
  comunicacao_equipe text not null,

  -- Motivação e Expectativas
  motivacao_vaga text not null,
  objetivo_carreira text not null,
  concorda_remuneracao text not null,

  -- Disponibilidade e Deslocamento
  compatibilidade_horario text not null,
  meio_deslocamento text not null,

  -- LGPD
  lgpd_aceite boolean not null default false
);

alter table candidatos_auxiliar_contabil enable row level security;

create policy "Permitir insercao publica"
  on candidatos_auxiliar_contabil
  for insert
  to anon
  with check (true);

create policy "Permitir leitura painel admin"
  on candidatos_auxiliar_contabil
  for select
  to anon
  using (true);

notify pgrst, 'reload schema';
