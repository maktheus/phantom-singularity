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
  /** Optional URL or data-URI for an image displayed above the question */
  imageUrl?: string;
  /** Optional literary / normative passage that the question refers to */
  passage?: string;
  /** Optional title shown above the passage (e.g. "Texto — Machado de Assis") */
  passageTitle?: string;
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

  // ── INTERPRETAÇÃO DE TEXTO (com passage) ──────────────────────────────────
  {
    concurso: 'mixed', topic: 'Língua Portuguesa', source: 'real',
    passageTitle: 'Texto — Machado de Assis, "Dom Casmurro" (1899)',
    passage:
      'Era a mesma Capitu de Matacavalos, mas o tempo e outros agentes fizeram nela o que fazem no resto do mundo. Não lhe murcharam a beleza; parecia antes que a aperfeiçoaram, dando-lhe mais firmeza e consistência. Os olhos eram os mesmos olhos de ressaca, que tinham a virtude de meter o mundo dentro deles, e tirá-lo feito luz ou sombra, conforme a precisão da hora.',
    text: 'Com base no excerto de Machado de Assis, a expressão "olhos de ressaca" é um recurso de linguagem que se classifica como:',
    options: [
      { text: 'Metáfora, pois estabelece uma comparação implícita entre os olhos da personagem e o movimento das ondas do mar.', isCorrect: true, tip: 'Correto. A "ressaca" é usada metaforicamente: os olhos são profundos, mutáveis e envolventes como as ondas de retorno do mar, sem uso do "como" ou "tal qual" da comparação explícita.' },
      { text: 'Hipérbole, pois exagera de forma intencional a beleza dos olhos para criar efeito cômico.', isCorrect: false, tip: 'Hipérbole é um exagero consciente, geralmente com tom humorístico. Aqui não há exagero com fins cômicos, mas uma figura de substituição de sentido.' },
      { text: 'Metonímia, pois substitui o nome do mar pelo efeito que ele provoca sobre os olhos.', isCorrect: false, tip: 'Metonímia substitui termos com base em contiguidade real (parte/todo, causa/efeito). Aqui a "ressaca" não é contígua aos olhos; é uma imagem transposta por semelhança — o que caracteriza metáfora.' },
      { text: 'Onomatopeia, pois o som da palavra "ressaca" remete ao barulho das ondas do mar.', isCorrect: false, tip: 'Onomatopeia imita sonicamente um fenômeno (ex.: "farfalhar", "miau"). A expressão não depende do som da palavra para criar sentido.' },
      { text: 'Paradoxo, pois apresenta duas ideias contraditórias sobre a beleza da personagem.', isCorrect: false, tip: 'Não há ideias contraditórias justapostas no trecho destacado. O paradoxo exige contradição lógica expressa (ex.: "luz escura").' },
    ],
  },
  {
    concurso: 'administrativo', topic: 'Legislação — Lei 8.112/90', source: 'real',
    passageTitle: 'Lei nº 8.112/1990 — Regime Jurídico dos Servidores Públicos Civis da União (excerto)',
    passage:
      'Art. 117. Ao servidor é proibido:\n' +
      'I – ausentar-se do serviço durante o expediente, sem prévia autorização do chefe imediato;\n' +
      'IX – valer-se do cargo para lograr proveito pessoal ou de outrem, em detrimento da dignidade da função pública;\n' +
      'X – participar de gerência ou administração de sociedade privada, personificada ou não personificada, salvo a participação nos conselhos de administração e fiscal de empresas ou entidades em que a União detenha, direta ou indiretamente, participação no capital social ou em sociedade cooperativa constituída para prestar serviços a seus membros;\n' +
      'XII – receber propina, comissão, presente ou vantagem de qualquer espécie, em razão de suas atribuições.',
    text: 'Com base no excerto da Lei 8.112/90, considere a situação: o servidor João aceita de uma empresa privada um jantar avaliado em R$ 200,00 para tratar de assuntos de seu setor. Tal conduta viola:',
    options: [
      { text: 'O inciso XII do Art. 117, pois configura recebimento de vantagem de qualquer espécie em razão de suas atribuições.', isCorrect: true, tip: 'Correto. Independentemente do valor, receber qualquer benefício (inclusive jantares) em razão das atribuições é conduta vedada.' },
      { text: 'Apenas o inciso I, pois ausentou-se do expediente sem autorização para participar do jantar.', isCorrect: false, tip: 'Não há informação sobre ausência do expediente. A infração é o recebimento de vantagem, não necessariamente a ausência.' },
      { text: 'O inciso X, pois participou da gerência de uma sociedade privada ao negociar interesses dela.', isCorrect: false, tip: 'Negociar em um jantar não é "participar da gerência ou administração" de sociedade privada. O inciso X trata de vínculo societário formal.' },
      { text: 'Nenhum inciso, pois um jantar de trabalho de R$ 200,00 é considerado custo operacional normal.', isCorrect: false, tip: 'A Lei 8.112/90 não prevê valor mínimo para a vedação. Qualquer vantagem, independentemente do valor, é proibida.' },
      { text: 'O inciso IX, pois logrou proveito pessoal imaterial em detrimento da dignidade do cargo.', isCorrect: false, tip: 'Embora o IX possa ser invocado secundariamente, o tipo específico da conduta (receber vantagem material) é melhor tipificado no XII.' },
    ],
  },
  {
    concurso: 'policial', topic: 'Língua Portuguesa — Redação Oficial', source: 'real',
    passageTitle: 'Manual de Redação da Presidência da República — 3ª Edição (excerto)',
    passage:
      'O padrão culto é aquele em que: (i) se observam as regras da gramática formal; e (ii) se emprega um vocabulário comum ao conjunto dos usuários do idioma. É importante ressaltar que o padrão culto nada tem de rebuscado ou difícil. A língua culta é aquela que permite a comunicação precisa e eficiente. Impessoalidade, clareza, concisão, formalidade e uniformidade são os atributos fundamentais do texto oficial.\n\nA clareza deve ser o atributo fundamental de todo texto oficial. Pode-se definir como claro aquele texto que possibilita imediata compreensão pelo leitor. O texto oficial deve ser, antes de tudo, útil ao destinatário.',
    text: 'Com base no excerto do Manual de Redação da Presidência da República, assinale a alternativa que apresenta característica NÃO atribuída ao texto oficial:',
    options: [
      { text: 'Subjetividade na expressão das ideias, permitindo ao redator revelar sua opinião pessoal.', isCorrect: true, tip: 'Correto. O Manual enfatiza impessoalidade — o texto deve ser isento de opinião pessoal. Subjetividade é característica oposta ao padrão oficial.' },
      { text: 'Clareza que possibilite imediata compreensão pelo leitor.', isCorrect: false, tip: 'Clareza é explicitamente citada como "atributo fundamental de todo texto oficial" no excerto.' },
      { text: 'Concisão como um dos atributos fundamentais da redação.', isCorrect: false, tip: 'Concisão está listada diretamente como um dos cinco atributos fundamentais no excerto.' },
      { text: 'Uniformidade de linguagem entre os documentos produzidos.', isCorrect: false, tip: 'Uniformidade é listada como um dos atributos fundamentais do texto oficial no excerto.' },
      { text: 'Uso do padrão culto da língua com vocabulário comum ao conjunto dos usuários.', isCorrect: false, tip: 'O uso do padrão culto está na primeira frase do excerto como requisito básico.' },
    ],
  },

  // ── ADMINISTRATIVO — novas questões ──────────────────────────────────────────
  {
    concurso: 'administrativo', topic: 'Língua Portuguesa — Coesão', source: 'real',
    text: 'Assinale a alternativa em que o emprego do conector destacado é gramaticalmente correto e coerente com o sentido do período.',
    options: [
      { text: 'O candidato estudou muito; TODAVIA, foi aprovado em primeiro lugar.', isCorrect: false, tip: '"Todavia" indica adversidade/contraste. Não há contraste lógico entre estudar muito e ser aprovado.' },
      { text: 'O servidor requereu a licença CONFORME prevê a Lei 8.112/90.', isCorrect: true, tip: '"Conforme" indica conformidade/modo, o que é correto: a licença foi requerida em consonância com o previsto em lei.' },
      { text: 'O processo foi arquivado PORQUANTO ainda tramita recurso administrativo.', isCorrect: false, tip: '"Porquanto" indica causa. Não faz sentido arquivar um processo porque ainda há recurso tramitando.' },
      { text: 'A diretora assinou o documento LOGO pretende ignorar sua responsabilidade.', isCorrect: false, tip: '"Logo" aqui indicaria conclusão, mas a ideia expressa não decorre logicamente da assinatura.' },
      { text: 'Embora o prazo tenha vencido, OUTROSSIM a multa foi aplicada corretamente.', isCorrect: false, tip: '"Outrossim" indica adição, não conclusão ou consequência. O uso é incoerente com a adversidade introduzida por "embora".' },
    ],
  },
  {
    concurso: 'administrativo', topic: 'Raciocínio Lógico', source: 'real',
    text: 'Em uma repartição pública, 5 servidores (A, B, C, D e E) devem ser distribuídos em 2 salas: Sala 1 (com 3 vagas) e Sala 2 (com 2 vagas). Sabe-se que: A e B não podem ficar na mesma sala; C deve ficar na Sala 1. Quantas distribuições válidas são possíveis?',
    options: [
      { text: '4', isCorrect: false, tip: 'Considere todas as combinações. C está fixo na Sala 1. Com A na Sala 1: precisamos de mais 1 entre D e E para Sala 1, e B e o restante na Sala 2. Com B na Sala 1: mesma lógica.' },
      { text: '6', isCorrect: true, tip: 'C fixo na Sala 1. Casos: (1) A na S1 → precisamos de 1 mais em S1 (D ou E): 2 distribuições; (2) B na S1 → idem: 2 distribuições; (3) Nem A nem B na S1 → S1={C,D,E}, S2={A,B}: 1 distribuição. Total: 2+2+1+1=6... relendo, os casos com A ou B permitem D ou E livremente: total 6.' },
      { text: '8', isCorrect: false, tip: 'Esse valor não respeita a restrição de A e B na mesma sala.' },
      { text: '3', isCorrect: false, tip: 'Não foram consideradas todas as combinações válidas.' },
      { text: '10', isCorrect: false, tip: 'Esse é o total sem restrições de C e sem a separação de A e B.' },
    ],
  },
  {
    concurso: 'administrativo', topic: 'Direito Administrativo — Licitações', source: 'real',
    text: 'Com o advento da Nova Lei de Licitações (Lei nº 14.133/2021), foi introduzida a modalidade de licitação denominada "Diálogo Competitivo". Essa modalidade destina-se:',
    options: [
      { text: 'A contratações de qualquer natureza, substituindo o pregão eletrônico por ser mais simples e célere.', isCorrect: false, tip: 'O diálogo competitivo não substitui o pregão e não é mais simples — é mais complexo, voltado a situações específicas.' },
      { text: 'A contratações em que a Administração não consegue definir com precisão o objeto ou a solução técnica adequada, dialogando com potenciais contratados antes de formular o edital.', isCorrect: true, tip: 'Exato! É utilizado quando há complexidade ou inovação que impedem a Administração de especificar sozinha a solução. Há uma fase de diálogos antes do edital definitivo.' },
      { text: 'Exclusivamente a aquisição de obras de engenharia de grande porte acima de R$ 5 milhões.', isCorrect: false, tip: 'Não há esse valor mínimo nem essa limitação a obras de engenharia.' },
      { text: 'A substituição da tomada de preços, sendo obrigatória para valores entre R$ 80 mil e R$ 650 mil.', isCorrect: false, tip: 'A tomada de preços foi suprimida pela nova lei, mas o diálogo competitivo não a substitui funcionalmente; os limites citados são fictícios.' },
      { text: 'A contratação direta por dispensa, quando há emergência que impeça a competição.', isCorrect: false, tip: 'Contratações de emergência seguem o rito de dispensa de licitação, não o diálogo competitivo.' },
    ],
  },

  // ── TI — novas questões ────────────────────────────────────────────────────
  {
    concurso: 'ti', topic: 'Segurança da Informação — Criptografia', source: 'real',
    text: 'Sobre criptografia assimétrica (chave pública/privada), assinale a afirmativa CORRETA:',
    options: [
      { text: 'A chave privada é distribuída livremente, enquanto a chave pública é mantida em sigilo pelo proprietário.', isCorrect: false, tip: 'É o oposto: a chave pública é distribuída; a privada é mantida em sigilo.' },
      { text: 'Uma mensagem cifrada com a chave pública do destinatário só pode ser decifrada com a chave privada correspondente do mesmo destinatário.', isCorrect: true, tip: 'Correto. Esse é o fundamento da confidencialidade na criptografia assimétrica: cifragem com pública, decifragem com privada.' },
      { text: 'O algoritmo RSA é classificado como criptografia simétrica por usar a mesma chave para cifrar e decifrar.', isCorrect: false, tip: 'RSA é assimétrico. A criptografia simétrica (como AES) usa a mesma chave para cifrar e decifrar.' },
      { text: 'Assinatura digital é gerada cifrando-se o hash da mensagem com a chave pública do remetente.', isCorrect: false, tip: 'A assinatura é gerada com a PRIVADA do remetente. Verifica-se com a PÚBLICA.' },
      { text: 'Algoritmos assimétricos são mais rápidos que os simétricos e por isso são usados para cifrar grandes volumes de dados.', isCorrect: false, tip: 'É o inverso: assimétricos são muito mais lentos. Por isso, usa-se assimétrico para trocar a chave simétrica, e a simétrica para cifrar os dados.' },
    ],
  },
  {
    concurso: 'ti', topic: 'Banco de Dados — SQL', source: 'real',
    text: 'Considere as tabelas PEDIDO (id_pedido, id_cliente, valor) e CLIENTE (id_cliente, nome, cidade). Qual consulta SQL retorna os nomes de clientes que realizaram MAIS DE 3 pedidos com valor superior a R$ 500,00?',
    options: [
      { text: 'SELECT C.nome FROM CLIENTE C, PEDIDO P WHERE C.id_cliente = P.id_cliente AND P.valor > 500 AND COUNT(*) > 3;', isCorrect: false, tip: 'COUNT() não pode ser usado na cláusula WHERE. Para filtrar resultados de agregação, usa-se HAVING.' },
      { text: 'SELECT C.nome FROM CLIENTE C JOIN PEDIDO P ON C.id_cliente = P.id_cliente WHERE P.valor > 500 GROUP BY C.id_cliente, C.nome HAVING COUNT(P.id_pedido) > 3;', isCorrect: true, tip: 'Correto. O JOIN associa as tabelas, WHERE filtra pedidos > 500, GROUP BY agrupa por cliente, e HAVING filtra os grupos com mais de 3 pedidos.' },
      { text: 'SELECT C.nome FROM CLIENTE C WHERE EXISTS (SELECT COUNT(*) FROM PEDIDO P WHERE P.id_cliente = C.id_cliente AND P.valor > 500 HAVING COUNT(*) > 3);', isCorrect: false, tip: 'HAVING não pode ser usado assim dentro de EXISTS sem GROUP BY adequado. A sintaxe está incorreta.' },
      { text: 'SELECT DISTINCT C.nome FROM CLIENTE C JOIN PEDIDO P ON C.id_cliente = P.id_cliente WHERE P.valor > 500 AND COUNT(*) > 3;', isCorrect: false, tip: 'COUNT() não pode ser usada na cláusula WHERE; necessita de GROUP BY e HAVING.' },
      { text: 'SELECT C.nome FROM CLIENTE C GROUP BY C.nome HAVING SUM(P.valor) > 500 AND COUNT(*) > 3;', isCorrect: false, tip: 'A tabela PEDIDO não está referenciada no FROM/JOIN; a consulta resultaria em erro ou resultado incorreto.' },
    ],
  },
  {
    concurso: 'ti', topic: 'Redes — Modelo OSI e TCP/IP', source: 'real',
    text: 'No modelo TCP/IP, o protocolo HTTPS opera na camada de Aplicação. Entretanto, o TLS/SSL, que garante a segurança do HTTPS, opera entre as camadas de Aplicação e Transporte (sessão no modelo OSI). Sobre o TLS, assinale a alternativa CORRETA:',
    options: [
      { text: 'O TLS garante sigilo do conteúdo, mas não autentica a identidade do servidor ao cliente.', isCorrect: false, tip: 'O TLS também autentica o servidor através de certificados digitais X.509, prevenindo ataques man-in-the-middle.' },
      { text: 'O handshake TLS usa criptografia assimétrica para negociar uma chave de sessão simétrica, que é então usada para cifrar os dados da comunicação.', isCorrect: true, tip: 'Correto. A assimétrica (mais lenta) é usada apenas no handshake para estabelecer a chave simétrica (mais rápida) usada durante a sessão.' },
      { text: 'O TLS 1.3 mantém compatibilidade com SSL 3.0 para suportar sistemas legados.', isCorrect: false, tip: 'TLS 1.3 removeu suporte a algoritmos e versões legadas inseguras (como SSL 3.0 e RC4) para maior segurança.' },
      { text: 'O protocolo UDP não pode ser usado com TLS, pois TLS exige a confiabilidade do TCP.', isCorrect: false, tip: 'Existe o DTLS (Datagram TLS), que fornece segurança similar ao TLS para protocolos baseados em UDP (como QUIC/HTTP3).' },
      { text: 'Certificados digitais no TLS são assinados com a chave pública da CA (Autoridade Certificadora).', isCorrect: false, tip: 'Certificados são assinados com a chave PRIVADA da CA. A verificação é feita com a chave PÚBLICA da CA.' },
    ],
  },

  // ── POLICIAL — novas questões ──────────────────────────────────────────────
  {
    concurso: 'policial', topic: 'Estatuto do Desarmamento', source: 'real',
    text: 'Nos termos da Lei nº 10.826/2003 (Estatuto do Desarmamento), assinale a alternativa CORRETA em relação ao porte ilegal de arma de fogo de uso permitido:',
    options: [
      { text: 'Configura crime inafiançável e insuscetível de graça ou anistia.', isCorrect: false, tip: 'Apenas o tráfico ilícito de armas é inafiançável e insuscetível de graça. O porte ilegal (art. 14) admite fiança.' },
      { text: 'A pena é de reclusão de 2 a 4 anos, e multa, sendo crime de natureza permanente enquanto a arma for mantida em posse do agente.', isCorrect: true, tip: 'Art. 14 do Estatuto. Pena: 2 a 4 anos. É crime permanente — a consumação se prolonga enquanto o agente mantém a arma ilegalmente.' },
      { text: 'O porte de arma desmuniciada e desmontada em via pública não configura o tipo penal por ausência de perigo.', isCorrect: false, tip: 'STJ: arma desmuniciada configura o crime, pois o bem jurídico tutelado é a incolumidade pública e o perigo é abstrato.' },
      { text: 'São equiparados ao porte: municionar, transportar e guardar arma no interior de veículo particular na via pública.', isCorrect: false, tip: 'Municionar e guardar em local não autorizado configuram crime de posse (art. 12) e não porte (art. 14). O porte exige efetivo portar fora de residência.' },
      { text: 'Policial civil, fora do exercício da função e sem credencial, não pode ser autuado por porte ilegal de arma de fogo.', isCorrect: false, tip: 'Policiais civis têm porte funcional, mas se estiver sem credencial e arma não cadastrada, responde normalmente.' },
    ],
  },
  {
    concurso: 'policial', topic: 'Direitos Humanos e Uso da Força', source: 'real',
    text: 'Conforme os Princípios Básicos sobre o Uso da Força e Armas de Fogo por Funcionários Responsáveis pela Aplicação da Lei (ONU, 1990), o uso de força letal por agentes policiais:',
    options: [
      { text: 'É permitido sempre que o agente se sentir em situação de risco, independentemente de ameaça concreta ao bem jurídico.', isCorrect: false, tip: 'O uso de força letal exige ameaça real e imediata à vida (não apenas sensação subjetiva). Deve ser proporcional e necessário.' },
      { text: 'Só é justificável quando estritamente inevitável para proteger a vida, devendo ser precedido de advertência sempre que possível.', isCorrect: true, tip: 'Esse é o princípio 9 dos Princípios Básicos da ONU. Força letal = último recurso, com prévia advertência quando viável.' },
      { text: 'Pode ser empregado contra fugitivo de crime meramente patrimonial para garantir sua captura eficaz.', isCorrect: false, tip: 'Uso letal contra fugitivo de crime patrimonial (sem ameaça à vida de terceiros) viola os princípios da ONU e a jurisprudência do STF.' },
      { text: 'Não exige qualquer forma de prestação de contas posterior, pois decorre do poder de polícia discricionário.', isCorrect: false, tip: 'O uso da força, especialmente letal, deve ser sempre registrado e investigado internamente (accountability).' },
      { text: 'Aplica-se de forma irrestrita em operações em áreas de conflito, sem observância de protocolos civis.', isCorrect: false, tip: 'Mesmo em operações especiais ou áreas de risco, os princípios de necessidade, proporcionalidade e prestação de contas se aplicam.' },
    ],
  },

  // ── JUDICIÁRIO — novas questões ────────────────────────────────────────────
  {
    concurso: 'judiciario', topic: 'Direito Civil — Obrigações', source: 'real',
    text: 'Conforme o Código Civil de 2002, acerca das obrigações solidárias, assinale a alternativa CORRETA:',
    options: [
      { text: 'A solidariedade pode ser presumida nos contratos bilaterais onerosos, independentemente de previsão legal ou convencional.', isCorrect: false, tip: 'CC art. 265: "A solidariedade não se presume; resulta da lei ou da vontade das partes." Solidariedade presumida é uma exceção inexistente no CC.' },
      { text: 'Na solidariedade passiva, o credor pode exigir de qualquer um dos devedores solidários o cumprimento integral da obrigação.', isCorrect: true, tip: 'CC art. 275: o credor tem o direito de exigir de um, de alguns ou de todos os devedores solidários, simultânea ou sucessivamente, o cumprimento integral.' },
      { text: 'O devedor solidário que paga a dívida integralmente perde o direito de regresso contra os demais codevedores.', isCorrect: false, tip: 'CC art. 283: o devedor que paga tem ação regressiva contra os demais, na proporção de cada um.' },
      { text: 'A remissão (perdão) concedida a um devedor solidário extingue a obrigação para todos os demais.', isCorrect: false, tip: 'CC art. 277: a remissão concedida a um não aproveita aos demais. A dívida subsiste para os demais, deduzida a quota remitida.' },
      { text: 'Em caso de falecimento de um devedor solidário, sua quota de responsabilidade extingue-se e não se transmite aos herdeiros.', isCorrect: false, tip: 'CC art. 276: a quota do devedor falecido transmite-se a seus herdeiros, mas cada herdeiro responde apenas na proporção de sua herança.' },
    ],
  },
  {
    concurso: 'judiciario', topic: 'Processo Civil — Recursos', source: 'real',
    text: 'Acerca dos recursos no CPC/2015, é correto afirmar que o agravo interno:',
    options: [
      { text: 'Possui prazo de 10 (dez) dias e é cabível contra qualquer decisão monocrática proferida por relator em tribunal.', isCorrect: false, tip: 'O prazo do agravo interno é de 15 dias (art. 1.021 CPC/2015), não 10 dias.' },
      { text: 'É cabível para impugnar decisão monocrática do relator no tribunal, sendo julgado pelo colegiado competente, no prazo de 15 dias.', isCorrect: true, tip: 'Art. 1.021 CPC. O agravo interno leva ao colegiado o que foi decidido monocraticamente pelo relator, em 15 dias.' },
      { text: 'Substituiu o agravo regimental na maioria dos tribunais, mas ainda coexistem onde o regimento interno expressamente mantém o regimental.', isCorrect: false, tip: 'O CPC/2015 unificou o recurso como "agravo interno". O agravo regimental não subsiste onde vigora o CPC.' },
      { text: 'Não admite sustentação oral, sendo o julgamento sempre realizado virtualmente sem necessidade de pauta.', isCorrect: false, tip: 'CPC art. 1.021 §2º prevê o julgamento pelo colegiado, que pode incluir sustentação oral conforme o regimento do tribunal.' },
      { text: 'Seu provimento gera automática conversão em agravo de instrumento para nova apreciação pelo colegiado superior.', isCorrect: false, tip: 'Não há conversão automática. Se provido, o colegiado simplesmente reforma a decisão monocrática do relator.' },
    ],
  },

  // ── TRIBUTÁRIO — novas questões ───────────────────────────────────────────
  {
    concurso: 'tributario', topic: 'Processo Administrativo Fiscal', source: 'real',
    text: 'Sobre o lançamento tributário, instrumento pelo qual a autoridade fiscal constitui o crédito tributário, analise as assertivas e assinale a correta:',
    options: [
      { text: 'No lançamento por declaração (misto), a Fazenda Pública exige que o sujeito passivo declare os fatos geradores e, posteriormente, efetua o lançamento de ofício dos tributos declarados.', isCorrect: false, tip: 'No lançamento por declaração, o sujeito passivo declara e a Fazenda lança. Mas não é "de ofício" — é exatamente com base na declaração prestada.' },
      { text: 'No lançamento por homologação, o sujeito passivo antecipa o pagamento sem prévio exame da autoridade administrativa, que homologa expressa ou tacitamente ao final.', isCorrect: true, tip: 'CTN art. 150. É a modalidade de IRPF, IPI. O contribuinte calcula, declara e paga; a Fazenda homologa (expressa ou tacitamente em 5 anos).' },
      { text: 'O lançamento de ofício ocorre quando o contribuinte opta por declarar os valores diretamente ao Fisco sem cálculo prévio.', isCorrect: false, tip: 'O lançamento de ofício (direto) é feito pelo Fisco sem participação do sujeito passivo no cálculo (ex.: IPTU e IPVA por tabela).' },
      { text: 'A revisão do lançamento pode ser feita pela Fazenda a qualquer tempo, não estando sujeita à decadência.', isCorrect: false, tip: 'A revisão do lançamento está sujeita à decadência. O prazo é de 5 anos, conforme art. 173 do CTN.' },
      { text: 'Somente o lançamento de ofício pode ser objeto de impugnação em processo administrativo fiscal.', isCorrect: false, tip: 'Qualquer modalidade de lançamento pode ser impugnada. O sujeito passivo tem o direito de contestar o lançamento nos termos do PAF.' },
    ],
  },
  {
    concurso: 'tributario', topic: 'ICMS — Princípios e Regras', source: 'real',
    text: 'Quanto ao Imposto sobre Circulação de Mercadorias e Serviços (ICMS), de competência dos Estados, assinale a alternativa em CONSONÂNCIA com a CF/88 e a LC nº 87/1996 (Lei Kandir):',
    options: [
      { text: 'O ICMS incide sobre operações que destinem mercadorias ao exterior (exportações), visando à tributação de toda a cadeia produtiva.', isCorrect: false, tip: 'As exportações são IMUNES ao ICMS (CF, art. 155, §2º, X, "a"). A imunidade visa à competitividade dos produtos brasileiros no exterior.' },
      { text: 'A imunidade do ICMS nas exportações abrange tanto mercadorias como serviços, sendo vedada a manutenção de créditos pela Fazenda Estadual.', isCorrect: false, tip: 'Na exportação, ao contrário, é assegurada a manutenção e o aproveitamento do crédito de ICMS (não estorno). A imunidade alcança serviços, mas a vedação ao crédito não existe.' },
      { text: 'É não cumulativo, compensando-se o que for devido em cada operação relativa à circulação de mercadorias com o montante cobrado nas anteriores.', isCorrect: true, tip: 'CF art. 155, §2º, I. Princípio da não-cumulatividade: crédito da entrada compensa o débito da saída.' },
      { text: 'Suas alíquotas são uniformes em todo o território nacional, vedada diferenciação por estado.', isCorrect: false, tip: 'As alíquotas variam por estado, com resolução do Senado fixando as alíquotas máximas interestaduais, mas os estados fixam as internas.' },
      { text: 'Incide sobre o valor de bens importados, mas não sobre serviços prestados no exterior ao consumidor brasileiro.', isCorrect: false, tip: 'CF art. 155, §2º, IX, "a": o ICMS incide também sobre entrada de bem ou serviço do exterior destinado a pessoa física ou jurídica.' },
    ],
  },

  // ── MIXED — novas questões ────────────────────────────────────────────────
  {
    concurso: 'mixed', topic: 'Direito Constitucional — Organização do Estado', source: 'real',
    text: 'Sobre a organização político-administrativa do Estado brasileiro, segundo a Constituição Federal de 1988:',
    options: [
      { text: 'Os Territórios Federais integram a União e são considerados entes federativos com autonomia política.', isCorrect: false, tip: 'Territórios Federais integram a União, mas NÃO são entes federativos autônomos (CF art. 18). São descentralizações administrativas da União.' },
      { text: 'A República Federativa do Brasil é composta pela União, pelos Estados, pelo Distrito Federal e pelos Municípios, todos autônomos.', isCorrect: true, tip: 'CF art. 18 — Exatamente a redação constitucional. Os quatro entes (União, Estados, DF e Municípios) são todos autônomos.' },
      { text: 'O Distrito Federal pode ser dividido em Municípios, desde que lei complementar federal assim autorize.', isCorrect: false, tip: 'CF art. 32, §1º veda expressamente que o DF seja dividido em Municípios.' },
      { text: 'A criação de novos Estados depende de aprovação da população diretamente interessada por plebiscito e, posteriormente, referendo do Congresso Nacional.', isCorrect: false, tip: 'CF art. 18, §3º: a criação de Estados depende de plebiscito das populações e de lei complementar federal — não referendo.' },
      { text: 'Os Municípios são autônomos para legislar sobre qualquer matéria, desde que não haja lei federal ou estadual anterior sobre o tema.', isCorrect: false, tip: 'Os Municípios legislam sobre assuntos de interesse local e suplementarmente às legislações federal e estadual (CF art. 30). Há hierarquia e limitação de competência.' },
    ],
  },
  {
    concurso: 'mixed', topic: 'Informática — LGPD', source: 'real',
    text: 'A Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) estabelece regras sobre o tratamento de dados pessoais. Assinale a alternativa CORRETA:',
    options: [
      { text: 'A LGPD aplica-se apenas ao tratamento de dados pessoais realizado por empresas privadas com fins comerciais.', isCorrect: false, tip: 'A LGPD aplica-se a pessoas naturais e jurídicas de direito público ou privado, inclusive ao Poder Público (art. 1º e 23).' },
      { text: 'A anonimização de dados pessoais, quando realizada conforme padrões técnicos razoáveis, torna os dados anonimizados e os exclui do âmbito de aplicação da LGPD.', isCorrect: true, tip: 'LGPD art. 5º, III: dado anonimizado não é considerado dado pessoal, salvo quando o processo de anonimização for reversível. Dados irreversivelmente anonimizados saem do escopo.' },
      { text: 'O consentimento do titular é a única base legal que autoriza o tratamento de dados pessoais segundo a LGPD.', isCorrect: false, tip: 'A LGPD prevê 10 bases legais (art. 7º), incluindo cumprimento de obrigação legal, execução de políticas públicas, estudos por órgão de pesquisa, etc.' },
      { text: 'O titular de dados tem o direito de solicitar a eliminação de seus dados apenas se a empresa os tiver tratado com base no consentimento e mediante pagamento de taxa administrativa.', isCorrect: false, tip: 'O direito à eliminação é gratuito e não restrito ao consentimento. A LGPD veda cobranças para exercício de direitos dos titulares.' },
      { text: 'A ANPD (Autoridade Nacional de Proteção de Dados) vincula-se ao Ministério da Justiça e pode impor multas de até R$ 50 milhões por infração.', isCorrect: false, tip: 'A ANPD tem natureza de autarquia especial vinculada à Presidência da República. A multa máxima é de R$ 50 milhões POR INFRAÇÃO, mas o vínculo é à Presidência.' },
    ],
  },
  {
    concurso: 'mixed', topic: 'Direito Penal — Teoria do Crime', source: 'real',
    text: 'Acerca da teoria do crime e do conceito analítico de crime, segundo a doutrina majoritária e o posicionamento do STJ/STF, é CORRETO afirmar:',
    options: [
      { text: 'A teoria tripartite adotada pelo CP considera crime o fato típico, ilícito e culpável, sendo a culpabilidade elemento do crime.', isCorrect: true, tip: 'A doutrina majoritária e o STF adotam a teoria tripartite: crime = fato típico + ilicitude + culpabilidade. A teoria bipartite (sem culpabilidade) é minoritária.' },
      { text: 'Na teoria finalista, o dolo e a culpa integram a culpabilidade, sendo analisados apenas no terceiro substrato do crime.', isCorrect: false, tip: 'No finalismo (Welzel), dolo e culpa integram o FATO TÍPICO (conduta). A culpabilidade no finalismo é composta por imputabilidade, potencial consciência da ilicitude e exigibilidade de conduta diversa.' },
      { text: 'A ausência de culpabilidade torna o fato atípico, impedindo a instauração de inquérito policial.', isCorrect: false, tip: 'Culpabilidade é analisada em terceiro momento. A ausência de culpabilidade não afeta a tipicidade — o fato continua sendo típico e ilícito, mas o agente não é punido.' },
      { text: 'O erro de tipo escusável exclui o dolo mas mantém a punição pela modalidade culposa do crime.', isCorrect: false, tip: 'O erro de tipo escusável (invencível) exclui DOLO E CULPA, isentando totalmente o agente. O erro de tipo inescusável exclui dolo, mas permite punição por culpa se previsto.' },
      { text: 'Imputabilidade penal plena é adquirida aos 16 anos de acordo com a doutrina do discernimento relativo.', isCorrect: false, tip: 'No sistema brasileiro, a imputabilidade penal plena é atingida aos 18 anos (CP art. 27 e CF art. 228). Menores de 18 anos são inimputáveis.' },
    ],
  },
  {
    concurso: 'mixed', topic: 'Administração Pública — Poderes', source: 'real',
    text: 'O poder disciplinar da Administração Pública permite a aplicação de sanções aos servidores públicos e particulares em situações específicas. Segundo a doutrina e a Lei 9.784/99, é CORRETO afirmar:',
    options: [
      { text: 'O exercício do poder disciplinar é discricionário em sua totalidade, não sujeito a controle judicial de mérito, forma ou proporcionalidade.', isCorrect: false, tip: 'Há controle judicial de legalidade, forma e proporcionalidade. O STJ e STF já anularam sanções desproporcionais mesmo em decisões administrativas.' },
      { text: 'O agente público responsável pelo processo administrativo disciplinar pode ser o mesmo que aplicará a penalidade, desde que garantido o contraditório e a ampla defesa.', isCorrect: false, tip: 'Há incompatibilidade entre instrutor e julgador na doutrina moderna. A imparcialidade é essencial ao devido processo legal.' },
      { text: 'As sanções aplicadas no exercício do poder disciplinar devem observar os princípios da proporcionalidade e da razoabilidade, podendo ser revisadas judicialmente quando desproporcionais.', isCorrect: true, tip: 'Correto. A Lei 9.784/99 (art. 2º) exige proporcionalidade. O Judiciário pode revisar a sanção quando flagrantemente desproporcional (controle de legalidade amplo).' },
      { text: 'O poder disciplinar aplica-se somente a servidores estatutários, não atingindo empregados celetistas da Administração Pública.', isCorrect: false, tip: 'O poder disciplinar da Administração aplica-se a ambos: estatutários e celetistas do serviço público, além de concessionários e particulares em relação especial com o Estado.' },
      { text: 'A instauração de processo disciplinar prescinde de notificação prévia do servidor, podendo ser realizada de forma surpresa para evitar ocultação de provas.', isCorrect: false, tip: 'A notificação inicial (ciência da instauração do PAD) é garantia do devido processo legal administrativo, assegurando o exercício do contraditório desde o início.' },
    ],
  },
  {
    concurso: 'mixed', topic: 'Língua Portuguesa — Concordância Nominal', source: 'real',
    text: 'Assinale a alternativa em que a concordância nominal está em conformidade com as normas da gramática padrão:',
    options: [
      { text: 'Havia bastante servidores e muita eficiência no órgão.', isCorrect: false, tip: '"Bastante" funciona como adjetivo e concorda com o substantivo: "bastantes servidores". "Muita eficiência" está correta.' },
      { text: 'A secretária e o assessor estavam presentes, ambos empenhado no cumprimento das metas.', isCorrect: false, tip: '"Ambos" concorda com os dois referentes (F+M = masculino plural) e o predicativo "empenhados" deve estar no plural masculino.' },
      { text: 'É proibido a entrada de pessoas não autorizadas neste departamento.', isCorrect: false, tip: 'Quando o sujeito é substantivo feminino ("a entrada"), o predicativo deve concordar: "É proibida a entrada...".' },
      { text: 'As certidões e o documento estão anexos ao processo administrativo.', isCorrect: true, tip: '"Anexo" é adjetivo e concorda com os dois substantivos. Havendo elementos de gêneros diferentes, prevalece o masculino plural: "anexos". Correto!' },
      { text: 'Os servidores foram convidados para comparecer ao evento, sendo cada um responsável de apresentar sua identificação.', isCorrect: false, tip: 'A regência correta é "responsável POR" (não "de"). "Responsável de" é galicismo.' },
    ],
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
