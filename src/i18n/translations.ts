export type SupportedLanguages = 'pt' | 'en' | 'es';

export interface LinkCopy {
  title: string;
  desc: string;
}

export interface Location {
  name: string;
  tag: string;
}

export interface Translation {
  // Navigation
  nav: {
    countdown: string;
    editions: string;
    world: string;
    characters: string;
    trailers: string;
    preorder: string;
  };
  // Hero / Countdown
  heroKicker: string;
  heroTagline: string;
  scrollHint: string;
  release: string;
  worldwideRelease: string;
  inYourTimezone: string;
  released: string;
  releasedSubtitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  // Timezone selector
  selectTz: string;
  detectingTz: string;
  searchTz: string;
  // Link hub (affiliate + invite)
  linksTitle: string;
  linksSubtitle: string;
  links: {
    preorder: LinkCopy;
    store: LinkCopy;
    newswire: LinkCopy;
    x: LinkCopy;
    youtube: LinkCopy;
    instagram: LinkCopy;
  };
  // Game facts
  factsTitle: string;
  factsSubtitle: string;
  facts: {
    release: string;
    platforms: string;
    studio: string;
    setting: string;
    mode: string;
    editions: string;
  };
  // Trailers
  trailers: string;
  trailersSubtitle: string;
  // World
  worldTitle: string;
  worldSubtitle: string;
  locations: Location[];
  // Gallery
  galleryTitle: string;
  galleryDescription: string;
  charactersFeatured: string;
  meetTheCrew: string;
  // Buttons
  purchase: string;
  addToCalendar: string;
  joinWhatsapp: string;
  // Pre-order / editions
  preOrderTitle: string;
  preOrderSubtitle: string;
  editionStandard: string;
  editionStandardDesc: string;
  editionUltimate: string;
  editionUltimateDesc: string;
  editionStandardFeatures: string[];
  editionUltimateFeatures: string[];
  mostPopular: string;
  bonusTitle: string;
  bonusVintage: string;
  bonusGtaPlus: string;
  platformsLabel: string;
  pcLater: string;
  preloadNote: string;
  // Share
  shareTitle: string;
  shareText: string;
  shareOnX: string;
  shareOnFacebook: string;
  shareOnReddit: string;
  // Footer
  fanMade: string;
  allRightsReserved: string;
  notAffiliated: string;
  // Misc
  language: string;
}

export type Translations = Record<SupportedLanguages, Translation>;

export const LOCALES: Record<SupportedLanguages, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

export const translations: Translations = {
  pt: {
    nav: {
      countdown: 'Contagem',
      editions: 'Edições',
      world: 'Mundo',
      characters: 'Personagens',
      trailers: 'Trailers',
      preorder: 'Pré-venda',
    },
    heroKicker: 'A contagem regressiva para',
    heroTagline: 'De volta a Vice City. O maior lançamento da história dos games está chegando.',
    scrollHint: 'Role para explorar',
    release: 'Data de Lançamento',
    worldwideRelease: 'Lançamento mundial · 19 de novembro de 2026',
    inYourTimezone: 'No seu fuso horário',
    released: 'JÁ DISPONÍVEL!',
    releasedSubtitle: 'GTA VI finalmente chegou. Bora pra Vice City!',
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    selectTz: 'Veja o lançamento no seu fuso horário',
    detectingTz: 'Detectando seu fuso horário...',
    searchTz: 'Buscar fuso horário',
    linksTitle: 'Prepare-se para o lançamento',
    linksSubtitle: 'Garanta sua reserva e siga os canais oficiais para não perder nenhuma novidade.',
    links: {
      preorder: { title: 'Fazer pré-venda', desc: 'Reserve na Amazon e garanta os bônus' },
      store: { title: 'Site Oficial', desc: 'Rockstar Games · GTA VI' },
      newswire: { title: 'Rockstar Newswire', desc: 'Últimas notícias e anúncios' },
      x: { title: 'Seguir no X', desc: '@RockstarGames' },
      youtube: { title: 'YouTube', desc: 'Trailers e vídeos oficiais' },
      instagram: { title: 'Instagram', desc: '@rockstargames' },
    },
    factsTitle: 'Tudo sobre o jogo',
    factsSubtitle: 'Os fatos essenciais de Grand Theft Auto VI num relance.',
    facts: {
      release: 'Lançamento',
      platforms: 'Plataformas',
      studio: 'Estúdio',
      setting: 'Cenário',
      mode: 'Modos',
      editions: 'Edições',
    },
    trailers: 'Trailers Oficiais',
    trailersSubtitle: 'Assista aos trailers oficiais lançados pela Rockstar Games.',
    worldTitle: 'O mundo de Leonida',
    worldSubtitle: 'Do neon de Vice City aos pântanos dos Keys — explore o maior mapa já criado pela Rockstar.',
    locations: [
      { name: 'Vice City', tag: 'A metrópole que nunca dorme' },
      { name: 'Leonida Keys', tag: 'Ilhas paradisíacas e contrabando' },
      { name: 'Port Gellhorn', tag: 'Cidade portuária decadente' },
      { name: 'Mount Kalaga', tag: 'Parque nacional selvagem' },
      { name: 'Ambrosia', tag: 'Refúgio ao entardecer' },
      { name: 'Grassrivers', tag: 'Pântanos e vida selvagem' },
    ],
    galleryTitle: 'Personagens',
    galleryDescription: 'Conheça os protagonistas do GTA VI',
    charactersFeatured: 'Os protagonistas',
    meetTheCrew: 'Conheça a turma',
    purchase: 'Fazer pré-venda',
    addToCalendar: 'Adicionar ao calendário',
    joinWhatsapp: 'Entrar no Grupo do WhatsApp',
    preOrderTitle: 'Pré-venda aberta',
    preOrderSubtitle: 'Reserve agora e garanta o Pacote Vintage Vice City. Pré-vendas digitais também ganham 1 mês de GTA+.',
    editionStandard: 'Edição Padrão',
    editionStandardDesc: 'O jogo completo de Grand Theft Auto VI para PS5 e Xbox Series X|S.',
    editionUltimate: 'Edição Ultimate',
    editionUltimateDesc: 'Tudo da Edição Padrão mais uma coleção exclusiva de veículos, armas e roupas premium.',
    editionStandardFeatures: [
      'Jogo base completo',
      'Pacote Vintage Vice City',
      'Disponível em PS5 e Xbox Series X|S',
    ],
    editionUltimateFeatures: [
      'Tudo da Edição Padrão',
      'Coleção de veículos exclusivos',
      'Armas e roupas premium',
      '1 mês grátis de GTA+',
    ],
    mostPopular: 'Mais popular',
    bonusTitle: 'Bônus de pré-venda',
    bonusVintage: 'Pacote Vintage Vice City',
    bonusGtaPlus: '1 mês grátis de GTA+ (pré-vendas digitais)',
    platformsLabel: 'Plataformas',
    pcLater: 'Versão para PC ainda sem data',
    preloadNote: 'Pré-carregamento das versões digitais a partir de 12 de novembro de 2026.',
    shareTitle: 'Compartilhe a contagem',
    shareText: 'Confira esta contagem regressiva para o GTA VI!',
    shareOnX: 'Compartilhar no X',
    shareOnFacebook: 'Compartilhar no Facebook',
    shareOnReddit: 'Compartilhar no Reddit',
    fanMade: 'Projeto de fã feito por',
    allRightsReserved: 'Todos os direitos reservados à',
    notAffiliated: 'Este site não é afiliado nem endossado pela Rockstar Games.',
    language: 'Idioma',
  },
  en: {
    nav: {
      countdown: 'Countdown',
      editions: 'Editions',
      world: 'World',
      characters: 'Characters',
      trailers: 'Trailers',
      preorder: 'Pre-order',
    },
    heroKicker: 'The countdown to',
    heroTagline: 'Back to Vice City. The biggest launch in gaming history is almost here.',
    scrollHint: 'Scroll to explore',
    release: 'Release Date',
    worldwideRelease: 'Worldwide release · November 19, 2026',
    inYourTimezone: 'In your timezone',
    released: 'OUT NOW!',
    releasedSubtitle: 'GTA VI is finally here. See you in Vice City!',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    selectTz: 'See the release in your timezone',
    detectingTz: 'Detecting your timezone...',
    searchTz: 'Search timezone',
    linksTitle: 'Get ready for launch',
    linksSubtitle: 'Lock in your pre-order and follow the official channels so you never miss a beat.',
    links: {
      preorder: { title: 'Pre-order now', desc: 'Reserve on Amazon & grab the bonuses' },
      store: { title: 'Official Site', desc: 'Rockstar Games · GTA VI' },
      newswire: { title: 'Rockstar Newswire', desc: 'Latest news and announcements' },
      x: { title: 'Follow on X', desc: '@RockstarGames' },
      youtube: { title: 'YouTube', desc: 'Official trailers and videos' },
      instagram: { title: 'Instagram', desc: '@rockstargames' },
    },
    factsTitle: 'Everything about the game',
    factsSubtitle: 'The essential facts of Grand Theft Auto VI at a glance.',
    facts: {
      release: 'Release',
      platforms: 'Platforms',
      studio: 'Studio',
      setting: 'Setting',
      mode: 'Modes',
      editions: 'Editions',
    },
    trailers: 'Official Trailers',
    trailersSubtitle: 'Watch the official trailers released by Rockstar Games.',
    worldTitle: 'The world of Leonida',
    worldSubtitle: 'From the neon of Vice City to the swamps of the Keys — explore the biggest world Rockstar has ever built.',
    locations: [
      { name: 'Vice City', tag: 'The city that never sleeps' },
      { name: 'Leonida Keys', tag: 'Island paradise and smuggling' },
      { name: 'Port Gellhorn', tag: 'A faded harbor town' },
      { name: 'Mount Kalaga', tag: 'Wild national park' },
      { name: 'Ambrosia', tag: 'A getaway at dusk' },
      { name: 'Grassrivers', tag: 'Swamps and wildlife' },
    ],
    galleryTitle: 'Characters',
    galleryDescription: 'Meet the protagonists of GTA VI',
    charactersFeatured: 'The protagonists',
    meetTheCrew: 'Meet the crew',
    purchase: 'Pre-order now',
    addToCalendar: 'Add to calendar',
    joinWhatsapp: 'Join WhatsApp Group',
    preOrderTitle: 'Pre-orders are open',
    preOrderSubtitle: 'Pre-order now to secure the Vintage Vice City Pack. Digital pre-orders also get 1 month of GTA+.',
    editionStandard: 'Standard Edition',
    editionStandardDesc: 'The full Grand Theft Auto VI game for PS5 and Xbox Series X|S.',
    editionUltimate: 'Ultimate Edition',
    editionUltimateDesc: 'Everything in the Standard Edition plus an exclusive collection of premium vehicles, weapons, and apparel.',
    editionStandardFeatures: [
      'Full base game',
      'Vintage Vice City Pack',
      'Available on PS5 & Xbox Series X|S',
    ],
    editionUltimateFeatures: [
      'Everything in Standard',
      'Exclusive vehicle collection',
      'Premium weapons & apparel',
      '1 free month of GTA+',
    ],
    mostPopular: 'Most popular',
    bonusTitle: 'Pre-order bonus',
    bonusVintage: 'Vintage Vice City Pack',
    bonusGtaPlus: '1 free month of GTA+ (digital pre-orders)',
    platformsLabel: 'Platforms',
    pcLater: 'PC version to come, no date yet',
    preloadNote: 'Digital pre-loading starts November 12, 2026.',
    shareTitle: 'Share the countdown',
    shareText: 'Check out this GTA VI countdown!',
    shareOnX: 'Share on X',
    shareOnFacebook: 'Share on Facebook',
    shareOnReddit: 'Share on Reddit',
    fanMade: 'Fan-made project by',
    allRightsReserved: 'All rights reserved to',
    notAffiliated: 'This site is not affiliated with or endorsed by Rockstar Games.',
    language: 'Language',
  },
  es: {
    nav: {
      countdown: 'Cuenta',
      editions: 'Ediciones',
      world: 'Mundo',
      characters: 'Personajes',
      trailers: 'Tráilers',
      preorder: 'Reservar',
    },
    heroKicker: 'La cuenta regresiva para',
    heroTagline: 'De vuelta a Vice City. El lanzamiento más grande de la historia de los videojuegos está por llegar.',
    scrollHint: 'Desplázate para explorar',
    release: 'Fecha de Lanzamiento',
    worldwideRelease: 'Lanzamiento mundial · 19 de noviembre de 2026',
    inYourTimezone: 'En tu zona horaria',
    released: '¡YA DISPONIBLE!',
    releasedSubtitle: 'GTA VI por fin llegó. ¡Nos vemos en Vice City!',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    selectTz: 'Mira el lanzamiento en tu zona horaria',
    detectingTz: 'Detectando tu zona horaria...',
    searchTz: 'Buscar zona horaria',
    linksTitle: 'Prepárate para el lanzamiento',
    linksSubtitle: 'Asegura tu reserva y sigue los canales oficiales para no perderte nada.',
    links: {
      preorder: { title: 'Reservar ahora', desc: 'Resérvalo en Amazon y consigue los bonus' },
      store: { title: 'Sitio Oficial', desc: 'Rockstar Games · GTA VI' },
      newswire: { title: 'Rockstar Newswire', desc: 'Últimas noticias y anuncios' },
      x: { title: 'Seguir en X', desc: '@RockstarGames' },
      youtube: { title: 'YouTube', desc: 'Tráilers y vídeos oficiales' },
      instagram: { title: 'Instagram', desc: '@rockstargames' },
    },
    factsTitle: 'Todo sobre el juego',
    factsSubtitle: 'Los datos esenciales de Grand Theft Auto VI de un vistazo.',
    facts: {
      release: 'Lanzamiento',
      platforms: 'Plataformas',
      studio: 'Estudio',
      setting: 'Escenario',
      mode: 'Modos',
      editions: 'Ediciones',
    },
    trailers: 'Tráilers Oficiales',
    trailersSubtitle: 'Mira los tráilers oficiales publicados por Rockstar Games.',
    worldTitle: 'El mundo de Leonida',
    worldSubtitle: 'Del neón de Vice City a los pantanos de los Keys — explora el mundo más grande jamás creado por Rockstar.',
    locations: [
      { name: 'Vice City', tag: 'La ciudad que nunca duerme' },
      { name: 'Leonida Keys', tag: 'Islas paradisíacas y contrabando' },
      { name: 'Port Gellhorn', tag: 'Un puerto en decadencia' },
      { name: 'Mount Kalaga', tag: 'Parque nacional salvaje' },
      { name: 'Ambrosia', tag: 'Un refugio al atardecer' },
      { name: 'Grassrivers', tag: 'Pantanos y vida salvaje' },
    ],
    galleryTitle: 'Personajes',
    galleryDescription: 'Conoce a los protagonistas de GTA VI',
    charactersFeatured: 'Los protagonistas',
    meetTheCrew: 'Conoce al grupo',
    purchase: 'Reservar ahora',
    addToCalendar: 'Añadir al calendario',
    joinWhatsapp: 'Unirse al Grupo de WhatsApp',
    preOrderTitle: 'Reservas abiertas',
    preOrderSubtitle: 'Reserva ahora para conseguir el Pack Vintage Vice City. Las reservas digitales también reciben 1 mes de GTA+.',
    editionStandard: 'Edición Estándar',
    editionStandardDesc: 'El juego completo de Grand Theft Auto VI para PS5 y Xbox Series X|S.',
    editionUltimate: 'Edición Ultimate',
    editionUltimateDesc: 'Todo lo de la Edición Estándar más una colección exclusiva de vehículos, armas y ropa premium.',
    editionStandardFeatures: [
      'Juego base completo',
      'Pack Vintage Vice City',
      'Disponible en PS5 y Xbox Series X|S',
    ],
    editionUltimateFeatures: [
      'Todo lo de la Estándar',
      'Colección de vehículos exclusivos',
      'Armas y ropa premium',
      '1 mes gratis de GTA+',
    ],
    mostPopular: 'Más popular',
    bonusTitle: 'Bonus de reserva',
    bonusVintage: 'Pack Vintage Vice City',
    bonusGtaPlus: '1 mes gratis de GTA+ (reservas digitales)',
    platformsLabel: 'Plataformas',
    pcLater: 'Versión para PC aún sin fecha',
    preloadNote: 'La precarga digital comienza el 12 de noviembre de 2026.',
    shareTitle: 'Comparte la cuenta regresiva',
    shareText: '¡Mira esta cuenta regresiva para GTA VI!',
    shareOnX: 'Compartir en X',
    shareOnFacebook: 'Compartir en Facebook',
    shareOnReddit: 'Compartir en Reddit',
    fanMade: 'Proyecto de fans hecho por',
    allRightsReserved: 'Todos los derechos reservados a',
    notAffiliated: 'Este sitio no está afiliado ni respaldado por Rockstar Games.',
    language: 'Idioma',
  },
};

export interface GalleryItem {
  title: string;
  description: string;
}

export const galleryItemsTranslations: Record<SupportedLanguages, GalleryItem[]> = {
  pt: [
    {
      title: 'Jason quer uma vida fácil',
      description: 'Jason cresceu entre criminosos e traficantes. Depois de um período no Exército tentando escapar de sua adolescência problemática, ele acabou nas Keys fazendo o que sabe fazer melhor: trabalhando para traficantes locais. Talvez seja hora de tentar algo novo.'
    },
    {
      title: 'O pai de Lucia a ensinou a lutar',
      description: 'A vida sempre foi dura com ela. Lutar por sua família a levou à Penitenciária Leonida. Sorte a tirou de lá. Lucia aprendeu a lição - daqui para frente, apenas jogadas inteligentes.'
    },
    {
      title: 'E se tudo na internet fosse verdade?',
      description: 'Amigo de Jason e associado de Brian, Cal se sente mais seguro em casa, bisbilhotando as comunicações da Guarda Costeira com algumas cervejas e algumas abas privadas abertas.'
    },
    {
      title: '"Tudo é sobre coração - o Valete de Copas"',
      description: 'Boobie é uma lenda local de Vice City - e age como tal. Um dos poucos que transformou seu tempo nas ruas em um império legítimo, abrangendo imóveis, um clube de strip e um estúdio de gravação - Boobie é todo sorrisos até a hora de falar de negócios.'
    },
    {
      title: '"Apenas Raw... Records"',
      description: 'Dre\'Quan sempre foi mais um malandro do que um gangster. Mesmo quando estava vendendo drogas nas ruas para sobreviver, entrar para a música sempre foi o objetivo.'
    },
    {
      title: '"Vídeos virais. Ganchos virais."',
      description: 'Bae-Luxe e Roxy, conhecidas como Real Dimez, são amigas desde o ensino médio - garotas com a malícia necessária para transformar o tempo que passaram extorquindo traficantes locais em dinheiro vivo através de faixas de rap picantes e uma presença implacável nas redes sociais.'
    },
    {
      title: '"Experiência conta."',
      description: 'Confiança, charme e astúcia - Raul é um assaltante de bancos experiente, sempre em busca de talentos dispostos a correr os riscos que trazem as maiores recompensas.'
    },
    {
      title: '"Nada melhor que um Mudslide no pôr do sol."',
      description: 'Brian é um clássico traficante da era de ouro do contrabando nas Keys. Ainda movendo mercadorias através de seu estaleiro com sua terceira esposa, Lori, Brian está no ramo há tempo suficiente para deixar que outros façam seu trabalho sujo.'
    }
  ],
  en: [
    {
      title: 'Jason wants an easy life',
      description: 'Jason grew up around gritters and crooks. After a stint in the Army trying to shake off his troubled teens, he found himself in the Keys doing what he knows best, working for local drug runners. It might be time to try something new.'
    },
    {
      title: 'Lucia\'s father taught her to fight',
      description: 'Life has been coming at her swinging ever since. Fighting for her family landed her in the Leonida Penitentiary. Sheer luck got her out. Lucia\'s learned her lesson – only smart moves from here.'
    },
    {
      title: 'What if everything on the internet was true?',
      description: 'Jason\'s friend and a fellow associate of Brian\'s, Cal feels safest hanging at home, snooping on Coast Guard comms with a few beers and some private browser tabs open.'
    },
    {
      title: '"It\'s all about heart — the Jack of Hearts"',
      description: 'Boobie is a local Vice City legend — and acts like it. One of the few to transform his time in the streets into a legitimate empire spanning real estate, a strip club, and a recording studio — Boobie\'s all smiles until it\'s time to talk business.'
    },
    {
      title: '"Only Raw... Records"',
      description: 'Dre\'Quan was always more of a hustler than a gangster. Even when he was dealing on the streets to make ends meet, breaking into music was the goal.'
    },
    {
      title: '"Viral videos. Viral hooks."',
      description: 'Bae-Luxe and Roxy aka Real Dimez have been friends since high school — girls with the savvy to turn their time shaking down local dealers into cold, hard cash via spicy rap tracks and a relentless social media presence.'
    },
    {
      title: '"Experience counts."',
      description: 'Confidence, charm, and cunning — Raul\'s a seasoned bank robber always on the hunt for talent ready to take the risks that bring the biggest rewards.'
    },
    {
      title: '"Nothing better than a Mudslide at sunset."',
      description: 'Brian\'s a classic drug runner from the golden age of smuggling in the Keys. Still moving product through his boat yard with his third wife, Lori, Brian\'s been around long enough to let others do his dirty work.'
    }
  ],
  es: [
    {
      title: 'Jason quiere una vida fácil',
      description: 'Jason creció entre criminales y traficantes. Después de un período en el Ejército tratando de dejar atrás su problemática adolescencia, terminó en los Keys haciendo lo que mejor sabe hacer: trabajando para traficantes locales. Quizás sea hora de intentar algo nuevo.'
    },
    {
      title: 'El padre de Lucia le enseñó a luchar',
      description: 'La vida siempre ha sido dura con ella. Luchar por su familia la llevó a la Penitenciaría Leonida. La pura suerte la sacó de allí. Lucia ha aprendido la lección: de ahora en adelante, solo jugadas inteligentes.'
    },
    {
      title: '¿Y si todo en internet fuera verdad?',
      description: 'Amigo de Jason y asociado de Brian, Cal se siente más seguro en casa, espiando las comunicaciones de la Guardia Costera con algunas cervezas y pestañas privadas abiertas.'
    },
    {
      title: '"Todo se trata del corazón - la Jota de Corazones"',
      description: 'Boobie es una leyenda local de Vice City, y actúa como tal. Uno de los pocos que transformó su tiempo en las calles en un imperio legítimo que abarca bienes raíces, un club de striptease y un estudio de grabación. Boobie es todo sonrisas hasta que es hora de hablar de negocios.'
    },
    {
      title: '"Solo Raw... Records"',
      description: 'Dre\'Quan siempre fue más un traficante que un gánster. Incluso cuando estaba vendiendo drogas en las calles para llegar a fin de mes, entrar en la música era el objetivo.'
    },
    {
      title: '"Videos virales. Ganchos virales."',
      description: 'Bae-Luxe y Roxy, conocidas como Real Dimez, han sido amigas desde la secundaria - chicas con la astucia para convertir el tiempo que pasaron extorsionando a traficantes locales en dinero en efectivo a través de canciones de rap picantes y una presencia implacable en redes sociales.'
    },
    {
      title: '"La experiencia cuenta."',
      description: 'Confianza, carisma y astucia - Raul es un experimentado atracador de bancos siempre en busca de talentos dispuestos a asumir los riesgos que reportan las mayores recompensas.'
    },
    {
      title: '"Nada mejor que un Mudslide al atardecer."',
      description: 'Brian es un clásico traficante de la época dorada del contrabando en los Cayos. Todavía mueve mercancías a través de su astillero con su tercera esposa, Lori. Brian lleva tanto tiempo en el negocio que deja que otros hagan su trabajo sucio.'
    }
  ]
};
