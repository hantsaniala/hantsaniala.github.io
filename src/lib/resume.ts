import { jsPDF } from 'jspdf';
import { site } from '../data/site';
import skills from '../data/skills.json';

const resumeData = {
  en: {
    bio: site.bio,
    role: site.role,
    experienceItems: [
      { role: 'CTO', company: 'LOVICI.FR', location: 'Guadeloupe, Full-remote', range: 'Nov 2025 \u2013 Present', summary: "Backend architecture and development in Go and Python for an e-commerce platform\nREST API and scalable microservices design\nCI/CD setup and AWS cloud infrastructure\nTechnical leadership, team mentoring, and code review" },
      { role: 'CTO, Lead Dev & DevOps', company: 'SAHA Technology', location: 'Antananarivo, Madagascar', range: 'Jun 2022 \u2013 Apr 2025', summary: "Led technical team of frontend and backend developers\nBuilt internal infrastructure and managed production environments\nTechnical recruitment and trained 5+ interns\nDirect client liaison translating business needs into technical solutions" },
      { role: 'Fullstack Developer (Python)', company: 'Cloud Diodes', location: 'USA (Remote)', range: 'Aug 2021 \u2013 May 2022', summary: "Designed SaaS Docker container monitoring application\nDeployment automation and infrastructure scripting" },
      { role: 'PHP Developer', company: 'Linkeo Madagascar', location: 'Antananarivo, Madagascar', range: 'Feb 2021 \u2013 Jul 2021', summary: "Integrated new payment system and maintained existing applications" },
      { role: 'Designer, Developer & SysAdmin', company: 'SIR Madagascar SARL', location: 'Ambohidratrimo, Madagascar', range: 'Feb 2014 \u2013 Jan 2021', summary: "System and network administration, automation script development\nCreative direction and desktop publishing (PAO)" },
    ],
    educationItems: [
      { school: 'ISM Advancea', degree: 'DTS Informatique', major: 'Management Information Systems', range: '2012 \u2013 2014' },
      { school: 'La Pertinence', degree: 'Baccalaur\u00e9at A2', major: '', range: '2008 \u2013 2012' },
    ],
    projects: [
      { name: 'Marketplace Manager', desc: 'Centralized multi-marketplace management app (PrestaShop, Amazon), distributed as Windows executable', tech: 'Go, Vue.js, PostgreSQL, Docker' },
      { name: 'hStream', desc: 'Secure HLS video streaming server with AES-128 encryption and automatic transcoding', tech: 'Go, Gin, FFmpeg, HLS, Redis' },
      { name: 'ElderConnect', desc: 'Multi-device platform (box, mobile, web) connecting elderly people with their support network', tech: 'Django, DRF, Flutter, WebSocket' },
      { name: 'EduStream', desc: 'Educational streaming platform with offline playback and AES-128 encryption', tech: 'Django, Celery, AWS, Redis' },
      { name: 'dj', desc: 'Django + uv CLI helper for streamlined Django project management', tech: 'Go, Docker, Django' },
      { name: 'trosa', desc: 'Mobile app to manage loan lists', tech: 'Dart, Flutter' },
      { name: 'backlog', desc: 'CLI tool for project backlog management', tech: 'Go' },
      { name: 'lazybacklog.nvim', desc: 'LazyVim plugin for Backlog \u2014 manage projects from Neovim', tech: 'Lua, Neovim' },
      { name: 'uploader', desc: 'Parallel file upload across multiple FTP servers', tech: 'Go, FTP' },
      { name: 'kpz', desc: 'DevOps CLI toolkit for local HTTPS subdomain routing', tech: 'Go, DevOps, HTTPS' },
    ],
    skillGroups: {
      'Languages': 'Languages', 'Framework': 'Frameworks', 'DevOps & Cloud': 'DevOps & Cloud',
      'Database & ORM': 'Databases', 'APIs': 'APIs', 'Platforms': 'Platforms', 'Operating Systems': 'OS',
    },
  },
  fr: {
    bio: "D\u00e9veloppeur backend freelance avec 10+ ans d\u2019exp\u00e9rience. Je con\u00e7ois et d\u00e9ploie des APIs, microservices et infrastructures cloud pour des startups et PME. Expert Go et Python, je livre des syst\u00e8mes performants, maintenables et pr\u00eats pour la production.",
    role: 'D\u00e9veloppeur Logiciel Freelance',
    experienceItems: [
      { role: 'CTO', company: 'LOVICI.FR', location: 'Guadeloupe, Full-remote', range: 'Nov 2025 \u2013 Pr\u00e9sent', summary: "Architecture et d\u00e9veloppement backend en Go et Python pour une plateforme e-commerce\nConception d\u2019APIs REST et microservices scalables\nMise en place CI/CD et infrastructure cloud AWS\nLeadership technique, mentorat d\u2019\u00e9quipe et revue de code" },
      { role: 'CTO, Lead Dev & DevOps', company: 'SAHA Technology', location: 'Antananarivo, Madagascar', range: 'Juin 2022 \u2013 Avr 2025', summary: "Direction technique d\u2019une \u00e9quipe de d\u00e9veloppeurs frontend et backend\nMise en place des infrastructures internes et gestion des environments de production\nRecrutement technique et formation de 5+ stagiaires\nRelation client directe pour traduire les besoins m\u00e9tier en solutions techniques" },
      { role: 'D\u00e9veloppeur Fullstack (Python)', company: 'Cloud Diodes', location: 'USA (Remote)', range: 'Ao\u00fbt 2021 \u2013 Mai 2022', summary: "Conception d\u2019une application SaaS de monitoring de conteneurs Docker\nAutomatisation de d\u00e9ploiements et scripts d\u2019infrastructure" },
      { role: 'D\u00e9veloppeur PHP', company: 'Linkeo Madagascar', location: 'Antananarivo, Madagascar', range: 'F\u00e9v 2021 \u2013 Juil 2021', summary: "Int\u00e9gration d\u2019un nouveau syst\u00e8me de paiement et maintenance d\u2019applications existantes" },
      { role: 'Graphiste, Dev & SysAdmin', company: 'SIR Madagascar SARL', location: 'Ambohidratrimo, Madagascar', range: 'F\u00e9v 2014 \u2013 Jan 2021', summary: "Administration syst\u00e8me et r\u00e9seaux, d\u00e9veloppement de scripts d\u2019automatisation\nDirection artistique et mise en page PAO" },
    ],
    educationItems: [
      { school: 'ISM Advancea', degree: 'DTS Informatique', major: "Syst\u00e8mes d\u2019information de gestion", range: '2012 \u2013 2014' },
      { school: 'La Pertinence', degree: 'Baccalaur\u00e9at A2', major: '', range: '2008 \u2013 2012' },
    ],
    projects: [
      { name: 'Marketplace Manager', desc: 'Application centralis\u00e9e de gestion multi-marketplaces (PrestaShop, Amazon), distribu\u00e9e en ex\u00e9cutable Windows', tech: 'Go, Vue.js, PostgreSQL, Docker' },
      { name: 'hStream', desc: 'Serveur de streaming vid\u00e9o HLS s\u00e9curis\u00e9 avec chiffrement AES-128 et transcodage automatique', tech: 'Go, Gin, FFmpeg, HLS, Redis' },
      { name: 'ElderConnect', desc: 'Plateforme multi-appareils (box, mobile, web) connectant les personnes \u00e2g\u00e9es \u00e0 leur r\u00e9seau de soutien', tech: 'Django, DRF, Flutter, WebSocket' },
      { name: 'EduStream', desc: 'Plateforme de streaming \u00e9ducatif avec lecture hors ligne et chiffrement AES-128', tech: 'Django, Celery, AWS, Redis' },
      { name: 'dj', desc: 'CLI helper Django + uv pour la gestion simplifi\u00e9e de projets Django', tech: 'Go, Docker, Django' },
      { name: 'trosa', desc: 'Application mobile de gestion de listes de pr\u00eats', tech: 'Dart, Flutter' },
      { name: 'backlog', desc: 'Outil CLI de gestion de backlog de projet', tech: 'Go' },
      { name: 'lazybacklog.nvim', desc: 'Plugin LazyVim pour Backlog \u2014 gestion de projets depuis Neovim', tech: 'Lua, Neovim' },
      { name: 'uploader', desc: 'Envoi de fichiers sur plusieurs serveurs FTP en parall\u00e8le', tech: 'Go, FTP' },
      { name: 'kpz', desc: 'Kit CLI DevOps pour le routage local de sous-domaines HTTPS', tech: 'Go, DevOps, HTTPS' },
    ],
    skillGroups: { 'Languages': 'Langages', 'Framework': 'Frameworks', 'DevOps & Cloud': 'DevOps & Cloud', 'Database & ORM': 'Bases de donn\u00e9es', 'APIs': 'APIs', 'Platforms': 'Plateformes', 'Operating Systems': 'Syst\u00e8mes' },
  },
} as const;

type Locale = 'en' | 'fr';
type RGB = [number, number, number];

function cleanSkillName(skill: string | { name: string; icon: string }): string {
  const name = typeof skill === 'string' ? skill : skill.name;
  const map: Record<string, string> = {
    'DjangoRESTFramework': 'DRF', 'VueJS': 'Vue.js', 'TailwindCSS': 'Tailwind CSS',
    'GitHubActions': 'GitHub Actions', 'SQlite': 'SQLite', 'Go SQLx': 'Go SQLx',
  };
  return map[name] || name;
}

function frPunct(s: string): string {
  return s.replace(/:/g, ' \u202f:').replace(/;/g, ' \u202f;').replace(/!/g, ' \u202f!').replace(/\?/g, ' \u202f?');
}

export function generateResume(): void {
  const locale = (localStorage.getItem('locale') || 'fr') as Locale;
  const t = resumeData[locale] || resumeData.fr;
  const isFr = locale === 'fr';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210, H = 297;
  const ML = 25, MR = 25, MT = 25, MB = 25;
  const CW = W - ML - MR;
  const BOTTOM = H - MB;
  const BLACK: RGB = [0, 0, 0];
  const DARK: RGB = [33, 33, 33];
  const MID: RGB = [80, 80, 80];
  const LIGHT: RGB = [120, 120, 120];
  const RULE: RGB = [180, 180, 180];
  let y = MT;

  function setFont(sz: number, style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal', clr: RGB = DARK) {
    doc.setFontSize(sz);
    doc.setFont('Times', style);
    doc.setTextColor(...clr);
  }
  function checkPage(n: number) {
    if (y + n > BOTTOM) {
      doc.addPage(); y = MT;
      setFont(10, 'bold', BLACK);
      doc.text(`${site.firstName} ${site.lastName}`, ML, y);
      setFont(8, 'italic', LIGHT);
      doc.text('CV', ML + doc.getTextWidth(`${site.firstName} ${site.lastName}`) + 4, y);
      const pg = 'page ' + doc.getNumberOfPages();
      doc.text(pg, W - MR - doc.getTextWidth(pg), y);
      y += 4; hRule(0.3); y += 3;
    }
  }
  function hRule(w = 0.25) { doc.setDrawColor(...RULE); doc.setLineWidth(w); doc.line(ML, y, W - MR, y); y += 2; }
  function wrap(s: string): string[] { return doc.splitTextToSize(s, CW); }
  function txt(s: string) { return isFr ? frPunct(s) : s; }
  function sectionTitle(title: string) { checkPage(12); y += 3; setFont(11, 'bold', BLACK); doc.text(title.toUpperCase(), ML, y); y += 2; hRule(0.4); y += 2; }

  // Header
  setFont(22, 'bold', BLACK); doc.text(`${site.firstName} ${site.lastName}`, ML, y); y += 8;
  setFont(11, 'normal', MID); doc.text(t.role, ML, y); y += 6;
  setFont(9, 'normal', MID); doc.text([site.email, site.phone, 'hantsaniala.is-a.dev'].join('  |  '), ML, y); y += 5;
  setFont(8.5, 'italic', LIGHT);
  const socials = site.socials.filter((s) => ['LinkedIn', 'GitHub'].includes(s.name)).map((s) => s.url.replace('https://', '').replace(/\/$/, ''));
  doc.text(socials.join('  |  '), ML, y); y += 5;
  hRule(0.5); y += 2;

  // Profile
  sectionTitle(isFr ? 'Profil' : 'Profile');
  setFont(10, 'italic', DARK); wrap(txt(t.bio)).forEach((l) => { checkPage(4.5); doc.text(l, ML, y); y += 4.5; }); y += 2;

  // Experience
  sectionTitle(isFr ? 'Exp\u00e9rience' : 'Experience');
  t.experienceItems.forEach((job, idx) => {
    const bullets = job.summary.split('\n').map((l) => l.replace(/^-?\s*/, '').trim()).filter(Boolean);
    let bh = 0; bullets.forEach((b) => { bh += wrap(b).length * 4.2; });
    checkPage(10 + bh);
    setFont(10.5, 'bold', BLACK); doc.text(job.role, ML, y);
    setFont(9, 'normal', LIGHT); doc.text(job.range, W - MR - doc.getTextWidth(job.range), y); y += 4.5;
    setFont(9, 'italic', MID); doc.text(job.location ? `${job.company}  |  ${job.location}` : job.company, ML, y); y += 4.5;
    bullets.forEach((b) => { wrap(txt(b)).forEach((l, i) => { checkPage(4.5); setFont(9.5, 'normal', DARK); doc.text((i === 0 ? '\u2022  ' : '   ') + l, ML + 4, y); y += 4.2; }); });
    y += 1.5; if (idx < t.experienceItems.length - 1) { hRule(0.15); y += 1.5; }
  });

  // Skills
  sectionTitle(isFr ? 'Comp\u00e9tences techniques' : 'Technical Skills');
  skills.filter((g) => ['Languages', 'Framework', 'DevOps & Cloud', 'Database & ORM', 'APIs', 'Platforms', 'Operating Systems'].includes(g.grouping))
    .map((g) => ({ label: t.skillGroups[g.grouping as keyof typeof t.skillGroups] || g.grouping, items: g.skills.map(cleanSkillName).filter((n) => n !== 'Bootstrap' && n !== 'PHP' && n !== 'Wordpress') }))
    .forEach((g) => {
      if (g.items.length === 0) return; checkPage(6);
      setFont(9.5, 'bold', DARK); doc.text(txt(`${g.label} :`), ML, y);
      setFont(9.5, 'normal', MID); const lw = doc.getTextWidth(txt(`${g.label} : `));
      wrap(g.items.join(', ')).forEach((l, i) => { doc.text(l, ML + (i === 0 ? lw : 0), y); y += 4.2; });
    }); y += 2;

  // Projects
  sectionTitle(isFr ? 'Projets' : 'Projects');
  t.projects.forEach((proj, idx) => {
    checkPage(10);
    setFont(10, 'bold', BLACK); doc.text(proj.name, ML, y);
    setFont(8, 'normal', LIGHT); doc.text(proj.tech, W - MR - doc.getTextWidth(proj.tech), y); y += 4.5;
    setFont(9.5, 'normal', DARK); wrap(txt(proj.desc)).forEach((l) => { checkPage(4.5); doc.text(l, ML, y); y += 4.2; });
    y += 2; if (idx < t.projects.length - 1) { hRule(0.1); y += 1; }
  });

  // Education (at end)
  sectionTitle(isFr ? 'Formation' : 'Education');
  t.educationItems.forEach((edu, idx) => {
    checkPage(12);
    setFont(10, 'bold', BLACK); doc.text(edu.school, ML, y);
    setFont(9, 'italic', LIGHT); doc.text(edu.range, W - MR - doc.getTextWidth(edu.range), y); y += 4.5;
    setFont(9.5, 'italic', MID); doc.text(edu.degree, ML, y); y += 4.2;
    if (edu.major) { setFont(9, 'italic', LIGHT); doc.text(edu.major, ML, y); y += 4.2; }
    y += 1.5; if (idx < t.educationItems.length - 1) { hRule(0.15); y += 1.5; }
  });

  doc.save(isFr ? 'CV-Hantsaniala-Eleo.pdf' : 'Resume-Hantsaniala-Eleo.pdf');
}
