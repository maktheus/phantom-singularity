export type ConcursoType =
  | 'policial'
  | 'tributario'
  | 'judiciario'
  | 'administrativo'
  | 'ti'
  | 'mixed';

export interface GeneratedQuestion {
  text: string;
  options: { text: string; isCorrect: boolean; tip: string }[];
  topic: string;
  source: 'real' | 'ai';
  concurso: ConcursoType;
}

// ── Real Question Bank ────────────────────────────────────────────────────────
const REAL_QUESTIONS: GeneratedQuestion[] = [
  // ── POLICIAL ──
  {
    concurso: 'policial', topic: 'Direito Penal', source: 'real',
    text: "Situação Hipotética: Tício, policial civil, durante uma operação de busca e apreensão autorizada judicialmente, encontra uma elevada quantia em dinheiro não relacionada à investigação. Decidindo apoderar-se do valor sem reportar aos superiores, ele oculta a quantia na viatura. Considerando a doutrina majoritária e o Código Penal, a conduta de Tício configura o crime de:",
    options: [
      { text: "Peculato-apropriação.", isCorrect: true, tip: "O funcionário público se apropria de dinheiro de que tem a posse em razão do cargo (CP, Art. 312, caput)." },
      { text: "Corrupção passiva.", isCorrect: false, tip: "Não houve solicitação ou recebimento de vantagem indevida em troca de um ato de ofício (Art. 317)." },
      { text: "Concussão.", isCorrect: false, tip: "A concussão exige a 'exigência' de vantagem indevida (Art. 316), o que não ocorreu." },
      { text: "Peculato-furto.", isCorrect: false, tip: "O peculato-furto ocorre quando o funcionário subtrai valendo-se da facilidade do cargo (Art. 312, §1º). Ele já tinha o acesso direto na busca." },
      { text: "Prevaricação.", isCorrect: false, tip: "Prevaricação é retardar ou deixar de praticar ato de ofício por sentimento pessoal (Art. 319)." }
    ]
  },
  {
    concurso: 'policial', topic: 'Direito Constitucional', source: 'real',
    text: "Segundo a Constituição Federal de 1988, no caso de iminente perigo público, a autoridade competente poderá usar de propriedade particular, assegurada ao proprietário:",
    options: [
      { text: "Indenização ulterior, se houver dano.", isCorrect: true, tip: "Redação exata do Art. 5º, XXV, da CF/88 (Requisição Administrativa)." },
      { text: "Prévia e justa indenização em dinheiro.", isCorrect: false, tip: "Isso se aplica à desapropriação por necessidade ou utilidade pública (Art. 5º, XXIV)." },
      { text: "Indenização ulterior, independentemente de haver dano material.", isCorrect: false, tip: "A indenização na requisição administrativa é condicionada à existência de dano." },
      { text: "A devolução imediata do bem sem direito a qualquer reparação pecuniária.", isCorrect: false, tip: "A CF assegura o direito à indenização caso haja dano." },
      { text: "Indenização prévia em títulos da dívida pública.", isCorrect: false, tip: "Isso ocorre em desapropriação por não cumprir a função social urbana (Art. 182, §4º, III)." }
    ]
  },
  {
    concurso: 'policial', topic: 'Código de Processo Penal', source: 'real',
    text: "Caiu no CESPE (Polícia Federal): Acerca do inquérito policial (IP), assinale a opção correta considerando a legislação e a jurisprudência dos tribunais superiores.",
    options: [
      { text: "O Ministério Público não poderá requerer a devolução do inquérito à autoridade policial, senão para novas diligências, imprescindíveis ao oferecimento da denúncia.", isCorrect: true, tip: "CPP, Art. 16. Exatamente a redação legal para evitar que o IP vire 'pingue-pongue', atrasando o processo." },
      { text: "O IP é um procedimento administrativo sigiloso, inquisitivo e dispensável, garantindo-se ao indiciado o exercício do contraditório.", isCorrect: false, tip: "No inquérito não há garantia do contraditório e da ampla defesa, pois é inquisitivo." },
      { text: "A autoridade policial poderá mandar arquivar autos de inquérito desde que provada a inocência.", isCorrect: false, tip: "A autoridade policial (Delegado) NUNCA pode mandar arquivar autos de IP (CPP, Art. 17)." },
      { text: "O arquivamento do IP, por decisão judicial, com base na atipicidade da conduta, não faz coisa julgada material.", isCorrect: false, tip: "Se arquivado por atipicidade ou excludente de ilicitude, faz coisa julgada material e não pode ser reaberto." },
      { text: "Nos crimes de ação penal pública condicionada a representação, o delegado de polícia pode iniciar o IP de ofício.", isCorrect: false, tip: "Precisa da representação da vítima para instaurar o IP nesses casos." }
    ]
  },
  
  // ── TRIBUTÁRIO ──
  {
    concurso: 'tributario', topic: 'CTN - Imunidade e Isenção', source: 'real',
    text: "Com relação ao Sistema Tributário Nacional e ao Código Tributário Nacional, assinale a opção correta acerca dos institutos da Imunidade e da Isenção.",
    options: [
      { text: "A imunidade constitui limitação constitucional ao poder de tributar, enquanto a isenção é a dispensa legal do pagamento do tributo devido.", isCorrect: true, tip: "Exato! Imunidade = Constituição (não nasce a obrigação). Isenção = Lei infraconstitucional (nasce, mas a lei dispensa)." },
      { text: "A isenção, salvo determinação em contrário de lei complementar, sempre é extensiva às taxas e às contribuições de melhoria.", isCorrect: false, tip: "Pelo contrário, o CTN diz que a isenção NÃO se estende a taxas e contribuições de melhoria, salvo se a lei expressamente determinar (Art. 177)." },
      { text: "Imunidade objetiva é aquela conferida a certas pessoas jurídicas, como partidos políticos e sindicatos de trabalhadores.", isCorrect: false, tip: "A imunidade para pessoas/entidades é chamada de SUBJETIVA. Imunidade objetiva aplica-se a bens (livros, jornais)." },
      { text: "As leis isentivas devem ser interpretadas de forma extensiva em casos de dúvidas favoráveis ao contribuinte.", isCorrect: false, tip: "CTN, Art. 111. A legislação que outorga isenção interpreta-se LITERALMENTE (restritivamente)." },
      { text: "A concessão de isenção de IPVA é de competência exclusiva da União em casos calamitosos.", isCorrect: false, tip: "O IPVA é um imposto Estadual. A União não pode conceder isenções de impostos de competência dos Estados (vedação de isenção heterônoma)." }
    ]
  },
  {
    concurso: 'tributario', topic: 'Responsabilidade Tributária', source: 'real',
    text: "Uma pessoa jurídica Y adquiriu integralmente o fundo de comércio da pessoa jurídica X e continuou a exploração da mesma atividade sob outra razão social. A empresa X encerrou suas atividades logo após a venda. No que tange à responsabilidade tributária pelos tributos devidos até a data do ato de alienação, a empresa Y responde:",
    options: [
      { text: "Integralmente, pois a alienante cessou a exploração do comércio.", isCorrect: true, tip: "CTN, Art. 133, I. Quando quem vende encerra as atividades, quem compra responde INTEGRALMENTE." },
      { text: "Subsidiariamente com o alienante.", isCorrect: false, tip: "A responsabilidade só seria subsidiária se a empresa X tivesse continuado a explorar atividade (ou retornado em até 6 meses)." },
      { text: "Solidariamente junto com os sócios da empresa extinta.", isCorrect: false, tip: "Não é solidária. A lei é clara em definir a responsabilidade integral ao adquirente neste contexto." },
      { text: "Não há responsabilidade da empresa adquirente desde que a CND tenha sido apresentada.", isCorrect: false, tip: "Apenas casos muito restritos (como alienação judicial em falência) não transferem responsabilidade. Compra comum transfere." },
      { text: "Apenas pelo montante que constar na escrituração contábil no momento da venda.", isCorrect: false, tip: "Responde integralmente pelos tributos, inclusive os devidos cuja autuação ocorrer no futuro." }
    ]
  },
  {
    concurso: 'tributario', topic: 'Impostos Federais', source: 'real',
    text: "O Imposto sobre a Propriedade Territorial Rural (ITR) tem características singulares no sistema tributário brasileiro. Assinale a alternativa em consonância com a jurisprudência do STF e a CF/88.",
    options: [
      { text: "Não incide sobre pequenas glebas rurais, definidas em lei, quando as explore o proprietário que não possua outro imóvel.", isCorrect: true, tip: "CF, Art. 153, §4º, II. Essa é a imunidade expressa das pequenas glebas." },
      { text: "Sua arrecadação não pode ser delegada aos Municípios, sob pena de inconstitucionalidade.", isCorrect: false, tip: "Ao contrário, a CF permite que a União delegue a arrecadação aos Municípios (passam a ficar com 100% da arrecadação)." },
      { text: "A função do ITR é puramente arrecadatória (fiscal).", isCorrect: false, tip: "Ele tem função EMINENTEMENTE EXTRAFISCAL: serve para desestimular latifúndios improdutivos (as alíquotas aumentam quanto pior o aproveitamento)." },
      { text: "Pode ter suas alíquotas majoradas por decreto do Poder Executivo (exceção à legalidade).", isCorrect: false, tip: "O ITR NÃO é exceção à legalidade (II, IE, IPI, IOF o são)." },
      { text: "Se sujeita à anterioridade do exercício, mas é exceção à anterioridade nonagesimal.", isCorrect: false, tip: "O ITR NÃO é exceção à noventena; submete-se a ambas as anterioridades." }
    ]
  },

  // ── JUDICIÁRIO ──
  {
    concurso: 'judiciario', topic: 'Processo Civil - Sentença', source: 'real',
    text: "Segundo as regras do Código de Processo Civil de 2015 sobre a fundamentação das decisões judiciais (Art. 489, §1º), NÃO se considera fundamentada a decisão que:",
    options: [
      { text: "Se limitar a invocar precedente ou enunciado de súmula, sem identificar seus fundamentos determinantes nem demonstrar que o caso sob julgamento se ajusta àqueles fundamentos.", isCorrect: true, tip: "Com o CPC/2015 o juiz precisa demonstrar o 'distinguishing' e a subsunção perfeita. Citar súmula solta gera nulidade." },
      { text: "Emplear conceitos jurídicos indeterminados, mesmo explicando o motivo concreto de sua incidência no caso.", isCorrect: false, tip: "O juiz PODE usar conceitos indeterminados desde que explique o motivo concreto que os determinou no caso." },
      { text: "Deixar de analisar tese suscitada pelas partes que seja manifestamente intempestiva ou preclusa.", isCorrect: false, tip: "O juiz não é obrigado a responder teses já preclusas ou que não sejam capazes de infirmar (derrubar) a conclusão adotada." },
      { text: "Julgar procedente o pedido baseando-se em um único argumento contundente invocado pelo autor.", isCorrect: false, tip: "Se o argumento é suficiente para a decisão por si só, o juiz cumpriu sua fundamentação." },
      { text: "Explicar a lei de forma concisa em juizados especiais, sem adentrar em profunda hermenêutica.", isCorrect: false, tip: "Em juizados, a decisão concisa e o relatório dispensado são permitidos pela Lei 9.099/95." }
    ]
  },
  {
    concurso: 'judiciario', topic: 'Controle de Constitucionalidade', source: 'real',
    text: "Na Ação Direta de Inconstitucionalidade (ADI) perante o Supremo Tribunal Federal, o cabimento e as regras materiais são rigorosos. Assinale a correta.",
    options: [
      { text: "Não caberá ADI contra lei municipal contestada em face da Constituição Federal.", isCorrect: true, tip: "Contra lei municipal, o controle de constitucionalidade com parâmetro na CF é feito via ADPF, não ADI." },
      { text: "O Advogado-Geral da União será previamente citado para atuar obrigatoriamente como curador da inconstitucionalidade da norma.", isCorrect: false, tip: "O AGU atua na defesa (presunção de constitucionalidade) do ato/lei, e não da inconstitucionalidade." },
      { text: "Os partidos políticos sem representação no Congresso Nacional são legitimados ativos para propor ADI.", isCorrect: false, tip: "CF Art. 103, VIII exige que o partido político tenha representação no Congresso Nacional." },
      { text: "A medida cautelar em ADI é dotada exclusivamente de eficácia ex tunc.", isCorrect: false, tip: "A cautelar, em regra, tem eficácia EX NUNC (daqui pra frente) e repristina a legislação anterior, salvo decisão expressa do controle." },
      { text: "O Presidente da República não tem legitimidade ativa universal, dependendo de pertinência temática.", isCorrect: false, tip: "O Presidente, o PGR, Mesas e PTB são legitimados UNIVERSAIS. Não precisam provar pertinência temática." }
    ]
  },
  {
    concurso: 'judiciario', topic: 'Direitos Fundamentais', source: 'real',
    text: "Sobre Habeas Data, Mandado de Injunção e Mandado de Segurança, indique a alternativa respaldada pela STF/CF.",
    options: [
      { text: "O habeas data é gratuito, mas o mandado de segurança não o é por natureza, exigindo preparo.", isCorrect: true, tip: "CF Art. 5º, LXXVII: São gratuitas o habeas corpus e o habeas data. MS paga custas, salvo gratuidade de justiça." },
      { text: "Mandado de injunção serve para tutelar o direito à certidão em repartições públicas.", isCorrect: false, tip: "O direito de certidão tutela-se por Mandado de Segurança, não Injunção." },
      { text: "Para retificação de dados pessoais em arquivo de caráter público, a única via é a judicial originária por Habeas Data, sem via administrativa exigida.", isCorrect: false, tip: "STF Súmula Vínculante 2: não cabe habeas data sem que haja recusa administrativa prévia." },
      { text: "Habeas corpus ampara direito líquido e certo não amparado por mandado de segurança.", isCorrect: false, tip: "O MS é que tutela direito líquido e certo NÃO amparado por HC ou HD. (Caráter residual do MS)." },
      { text: "Mandado de Injunção coletivo não pode ser impetrado por partido político.", isCorrect: false, tip: "O MI coletivo PODE ser impetrado pelas mesmas pessoas que podem impetrar MS coletivo, incluindo Partidos Partidários." }
    ]
  },

  // ── ADMINISTRATIVO ──
  {
    concurso: 'administrativo', topic: 'Atos Administrativos', source: 'real',
    text: "Em relação aos atributos dos Atos Administrativos e aos pressupostos de sua validade, é considerado vício de competência insanável que impede a convalidação quando o ato for:",
    options: [
      { text: "Praticado sob delegação em matérias de competência exclusiva por lei.", isCorrect: true, tip: "Matérias exclusivas (ex: edição de atos de caráter normativo) não são delegáveis e não suportam convalidação." },
      { text: "Praticado por agente de fato em situação de urgência para evitar dano social.", isCorrect: false, tip: "Atos de agentes de fato costumam ser preservados com base na teoria da aparência e em proteção a terceiros de boa-fé." },
      { text: "Ausente o pressuposto de motivo válido em ato discricionário.", isCorrect: false, tip: "Vício de MOTIVO não é convalidável, mas a questão pede vício de COMPETÊNCIA insanável." },
      { text: "Lavrado de forma escrita sem timbre da instituição nos casos onde há essa exigência de controle.", isCorrect: false, tip: "Falta de timbre é falha de FORMA. Pode ser convalidada se não for essencial à validade legal." },
      { text: "Aplicado de punição administrativa que se pautou por laudo pericial falso comprovado a posteriori.", isCorrect: false, tip: "Se o laudo era falso, o vício foi de MOTIVO, não vício de competência da autoridade." }
    ]
  },
  {
    concurso: 'administrativo', topic: 'Responsabilidade Civil do Estado', source: 'real',
    text: "Conforme a atual jurisprudência do STF sobre a Responsabilidade Civil do Estado (Art. 37, §6º da CF/88):",
    options: [
      { text: "A ação de indenização da vítima deve ser ajuizada contra o Estado, que poderá buscar o regresso contra o servidor culpado. É inadmissível que o lesado mova ação direta apenas contra o servidor.", isCorrect: true, tip: "Decisão do STF. Teoria da Dupla Garantia: a vítima aciona o Estado (RF Objetiva) e o Estado entra contra o servidor (Subjetiva)." },
      { text: "O Estado não responde pela conduta de concessionárias prestadoras de serviço público caso elas venham à falência.", isCorrect: false, tip: "O Estado tem responsabilidade SUBSIDIÁRIA. Caso a concessionária faliu e não pague, o Estado arca." },
      { text: "Tratando-se de danos causados por detento foragido há vários meses do complexo prisional, o Estado tem responsabilidade objetiva irrestrita.", isCorrect: false, tip: "Se há muito tempo entre a fuga e o crime (quebra de nexo causal), a responsabilidade do Estado não é imputada nestes moldes." },
      { text: "A responsabilização civil exige a comprovação do dolo, mesmo para o Estado-juiz nos casos de prisões indevidas.", isCorrect: false, tip: "Estando preso indevidamente, o dever de indenizar do Estado independe de provar dolo do magistrado (R. Objetiva)." },
      { text: "Concessionárias de serviço público respondem objetivamente a usuários, mas apenas subjetivamente quanto aos não usuários atingidos pelo serviço.", isCorrect: false, tip: "STF firmou: Concessionária responde objetivamente para usuários E TAMBÉM não usuários atingidos." }
    ]
  },

  // ── TI E TECNOLOGIA ──
  {
    concurso: 'ti', topic: 'Desenvolvimento e JavaScript', source: 'real',
    text: "Muitos editais para desenvolvimento exigem conhecimento sólido sobre a manipulação de Arrays no ES6+. Dado um array e os métodos find() e filter(), assinale a afirmativa correta:",
    options: [
      { text: "O filter() sempre retorna um array (mesmo que vazio), ao passo que o find() retorna o primeiro elemento avaliado como true na função callback ou undefined se nada for encontrado.", isCorrect: true, tip: "Exato! É a diferença clássica: find = 1 valor ou undefined; filter = Array." },
      { text: "O find() itera em todos os elementos obrigatoriamente, enquanto filter() pausa ao achar a primeira ocorrência.", isCorrect: false, tip: "É o inverso. Find() interrompe no 1º match (short-circuit), filter() percorre tudo." },
      { text: "Ambos corrompem/alteram diretamente o array original (array mutável).", isCorrect: false, tip: "Nenhum deles altera o original. Ambos retornam novas cópias (não-mutáveis)." },
      { text: "Se a função callback retornar 0 para filter(), esse elemento estará presente no novo array por ser um número válido.", isCorrect: false, tip: "O 0 (zero) no JavaScript é avaliado como falsy, portanto filter() EXCLUIRÁ ele." },
      { text: "O método reduce() consegue simular o find(), mas nunca o filter(), pois o acumulador obriga o retorno de um tipo primitivo.", isCorrect: false, tip: "Reduce consegue recriar filter, map e find, pois o acumulador não é limitado a primitivos (pode ser o array acumulado [])" }
    ]
  },
  {
    concurso: 'ti', topic: 'Arquitetura Rest', source: 'real',
    text: "Em relação ao padrão arquitetural REST (Representational State Transfer) aplicado na construção de Web APIs, julgue a seguinte situação com base nas constraints (restrições) de Roy Fielding:",
    options: [
      { text: "Ser Stateless implica que nenhuma informação de sessão/estado do cliente pode ficar armazenada no Servidor entre os requests.", isCorrect: true, tip: "Statelessness (não manter estado de sessão) é uma restrição vital do REST para escalabilidade horizontal." },
      { text: "REST define que APIs devam trafegar suas payloads exclusivamente em formato JSON.", isCorrect: false, tip: "Falso. REST não impõe formato (pode ser XML, JSON, texto puro). O formato é acordado via content-negotiation." },
      { text: "Uma API que utiliza os verbos GET, POST, e executa ações de delete enviando 'action=delete' na querystring de um POST obedece estritamente ao REST.", isCorrect: false, tip: "Erradíssimo. Não usar adequadamente o mapeamento HTTP (verbo DELETE p/ deletar) quebra os princípios do REST (HATEOAS e interface uniforme)." },
      { text: "Servidores REST não funcionam por trás de proxies reversos ou CDNs como a CloudFlare.", isCorrect: false, tip: "Pelo contrário. Uma das constraints é a Arquitetura em Camadas (Layered System), o que permite o uso intensivo de Proxies e Balancer." },
      { text: "O HATEOAS visa forçar a criptografia dos links trocados no JSON da resposta, tornando a API blindada.", isCorrect: false, tip: "HATEOAS significa 'Hypermedia as the Engine of Application State', servindo para retornar links/rotas de navegação viáveis ao cliente no JSON response, não é sobre criptografia." }
    ]
  },
  {
    concurso: 'ti', topic: 'Bancos de Dados SQL vs NoSQL', source: 'real',
    text: "Na escolha entre Bancos de Dados Relacionais e Não Relacionais (NoSQL), os critérios ACID (Atomicidade, Consistência, Isolamento e Durabilidade) e o Teorema CAP (Consistência, Disponibilidade e Partição) guiam a arquitetura. Deste modo, um banco como o MongoDB prioriza:",
    options: [
      { text: "Geralmente CP ou AP no Teorema CAP (com o tempo provou ser configurável), abrindo mão do rigor do esquema ACID em favor da eventual consistency em implementações de largas escalas horizontalmente.", isCorrect: true, tip: "Especialmente bancos baseados em documentos distribuídos não mantêm bloqueios rigorosos de transações ACID por padrão, favorecendo BASE e partições distribuídas." },
      { text: "Atomicidade rigorosa em nível de multi-documentos cruzando coleções por default nativo sem configurações estritas de sessions.", isCorrect: false, tip: "O forte de bancos de documentos não é transação multi-coleção. As transições complexas devem ficar na camada relacional." },
      { text: "Normalização estruturada na Terceira Forma Normal (3FN), reduzindo o espaço de armazenamento de dados aninhados.", isCorrect: false, tip: "O NoSQL (especialmente documentos) incentiva a DESNORMALIZAÇÃO e o embedding (aninhamento) de dados." },
      { text: "Garantir tolerância contra qualquer injunção de chaves estrangeiras com constraint check robustos vindos da máquina engine.", isCorrect: false, tip: "Mongo não tem Constraint Checks de chaves estrangeiras automáticos no sentido relacional." },
      { text: "Aderência total a todas as vertentes C, A e P de CAP simultaneamente sob qualquer premissa de falha.", isCorrect: false, tip: "É impossível aderir às 3 simultaneamente segundo o teorema CAP. Escolhe-se 2 num dado cenário de partição/falha." }
    ]
  },
];

// ── LLM Question Generator ────────────────────────────────────────────────────

const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

const PROMPT_TEMPLATES: Record<string, string> = {
  policial:      'segurança pública, direito penal, processo penal, uso da força, ética policial',
  tributario:    'direito tributário, CTN, princípios tributários, impostos federais, ICMS, ISS',
  judiciario:    'Poder Judiciário, STF, STJ, competências dos tribunais, processo civil, mandado de segurança',
  administrativo: 'Administração Pública, LIMPE, licitações, contratos administrativos, servidores públicos',
  ti:            'segurança da informação, redes de computadores, protocolos, banco de dados, algoritmos, LGPD',
  mixed:         'concursos públicos em geral: direito constitucional, administrativo, tributário, penal, segurança da informação',
};

export async function generateAIQuestions(
  concurso: ConcursoType,
  count: number = 3
): Promise<GeneratedQuestion[]> {
  const topic = PROMPT_TEMPLATES[concurso];

  const prompt = `Você é um professor especialista em concursos públicos brasileiros.
Gere exatamente ${count} questões de múltipla escolha sobre ${topic}.
Cada questão deve ter exatamente 5 alternativas (A a E), apenas 1 correta.

RETORNE ESTRITAMENTE o JSON abaixo, sem mais nada:
{
  "questions": [
    {
      "text": "Enunciado completo da questão",
      "options": [
        { "text": "Alternativa A", "isCorrect": false, "tip": "Explicação por que A está errada" },
        { "text": "Alternativa B", "isCorrect": true,  "tip": "Explicação por que B é o gabarito" },
        { "text": "Alternativa C", "isCorrect": false, "tip": "Explicação por que C está errada" },
        { "text": "Alternativa D", "isCorrect": false, "tip": "Explicação por que D está errada" },
        { "text": "Alternativa E", "isCorrect": false, "tip": "Explicação por que E está errada" }
      ]
    }
  ]
}`;

  const body = {
    model: 'llama3.2',
    prompt,
    stream: false,
    options: { temperature: 0.7, num_predict: 2000 },
    format: 'json',
  };

  const resp = await fetch(OLLAMA_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });

  if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);

  const data = await resp.json();
  const parsed = JSON.parse(data.response ?? data.message?.content ?? '{}');
  const rawQs: any[] = parsed.questions ?? [];

  return rawQs.slice(0, count).map(q => ({
    text: q.text,
    options: q.options,
    topic: topic.split(',')[0],
    source: 'ai' as const,
    concurso,
  }));
}

// ── Smart Queue: mix real + AI ────────────────────────────────────────────────
export function getRealQuestions(concurso: ConcursoType): GeneratedQuestion[] {
  if (concurso === 'mixed') return REAL_QUESTIONS;
  return REAL_QUESTIONS.filter(q => q.concurso === concurso);
}

export function shuffleQuestions(qs: GeneratedQuestion[]): GeneratedQuestion[] {
  const a = [...qs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { REAL_QUESTIONS };
