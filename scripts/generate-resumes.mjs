import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const site = {
  firstName: 'Hantsaniala', lastName: 'Eléo',
  email: 'hantsaniala@gmail.com', phone: '(+261)32 99 025 43',
  linkedin: 'linkedin.com/in/hantsaniala', github: 'github.com/hantsaniala',
};

const data = {
  fr: {
    role: 'Ingénieur Backend & DevOps Senior',
    profile: "Ingénieur backend senior avec 10+ ans d'expérience dans la conception et le déploiement de systèmes de production en Go et Python. Expérience de niveau CTO : direction d'équipes techniques, architecture microservices et infrastructure cloud. Livraisons prouvées de plateformes e-commerce, applications SaaS et outils de développement. Contributeur open-source avec 15+ dépôts publics.",
    sections: { experience: 'EXPÉRIENCE', skills: 'COMPÉTENCES TECHNIQUES', projects: 'PROJETS', education: 'FORMATION' },
    jobs: [
      { role: 'CTO', company: 'LOVICI.FR, Guadeloupe, Full-remote', range: 'Nov 2025 - Présent', bullets: ["Architecture backend Go/Python pour plateforme e-commerce (catalogue, commandes, paiements)","Conception d'APIs REST et microservices à déploiement indépendant, accélérant la vélocité d'équipe","Mise en place CI/CD avec GitHub Actions, Docker et CloudFlare, réduisant le cycle de release de jours à heures","Direction technique : revues de code et décisions d'architecture"] },
      { role: 'CTO, Lead Dev & DevOps', company: 'SAHA Technology, Antananarivo, Madagascar', range: 'Juin 2022 - Avr 2025', bullets: ["Direction d'une équipe de 5+ développeurs frontend et backend sur plusieurs produits","Infrastructure de production avec Docker, gestion des environnements staging et production","Recrutement, intégration et mentorat de 5+ ingénieurs, mise en place de standards et revues de code","Contact technique principal avec les clients, traduction des besoins métier en architecture système"] },
      { role: 'Développeur Fullstack (Python)', company: 'Cloud Diodes, US, NY, Full-remote', range: 'Août 2021 - Mai 2022', bullets: ["Dashboard SaaS de monitoring Docker avec métriques temps réel et alertes (Django, Redis)","Automatisation des déploiements et provisioning avec Bash et Docker Compose"] },
      { role: 'Développeur PHP', company: 'Linkeo Madagascar, Antananarivo', range: 'Fév 2021 - Juil 2021', bullets: ["Intégration de passerelle de paiement tierce, réduisant les frictions de checkout","Maintenance et refactoring du codebase Symfony legacy, améliorant les temps de chargement"] },
      { role: 'SysAdmin & Développeur', company: 'SIR Madagascar SARL, Ambohidratrimo', range: 'Fév 2014 - Jan 2021', bullets: ["Administration infrastructure Linux (Ubuntu/Debian), réseau et hardening sécurité","Scripts d'automatisation (backups, déploiements, monitoring), réduisant l'ops manuelle de 40%","Développement d'outils internes et d'applications web pour les opérations métier"] },
    ],
    skills: [
      { label: 'Langages', items: 'Go, Python, Dart, SQL, Bash, JavaScript' },
      { label: 'Frameworks', items: 'Go Gin, Django, DRF, Flutter, Vue.js, Celery, Redis' },
      { label: 'APIs', items: 'REST, GraphQL, gRPC, WebSockets' },
      { label: 'Cloud & DevOps', items: 'Docker, GitHub Actions, CloudFlare, NGINX' },
      { label: 'Bases de données', items: 'PostgreSQL, MySQL, SQLite, GORM, SQLAlchemy' },
    ],
    projects: [
      { name: 'Marketplace Manager', tech: 'Go, Vue.js, PostgreSQL, Docker', desc: 'App de gestion multi-marketplaces (PrestaShop, Amazon) : backend Go, frontend Vue.js, PostgreSQL, exécutable Windows' },
      { name: 'hStream', tech: 'Go, Gin, FFmpeg, Redis', desc: 'Serveur streaming HLS avec chiffrement AES-128, transcodage automatique et déploiement Docker' },
      { name: 'ElderConnect', tech: 'Django, DRF, Flutter, WebSocket', desc: 'Plateforme multi-appareils (box, mobile, web) connectant personnes âgées et aidants : mises à jour temps réel' },
      { name: 'EduStream', tech: 'Django, Celery, Docker, Redis', desc: 'Plateforme streaming éducatif avec lecture hors ligne, traitement Celery et chiffrement AES-128' },
      { name: 'dj', tech: 'Go, Docker, Django', desc: 'CLI pour Django + uv : scaffolding, gestion et déploiement de projets Django depuis le terminal' },
      { name: 'kpz', tech: 'Go, DevOps, HTTPS', desc: 'Kit CLI DevOps pour le routage local de sous-domaines HTTPS avec certificats TLS automatiques' },
    ],
    education: [
      { school: 'ISM Advancea', degree: 'DTS Informatique', major: "Génie logiciel", range: '2012 - 2014' },
    ],
  },
  en: {
    role: 'Senior Backend & DevOps Engineer',
    profile: "Senior backend engineer with 10+ years building and scaling production systems in Go and Python. CTO-level experience leading technical teams, architecting microservices, and shipping cloud infrastructure and DevOps pipelines. Proven track record delivering e-commerce platforms, SaaS applications, and developer tooling. Open-source contributor with 15+ public repositories.",
    sections: { experience: 'EXPERIENCE', skills: 'TECHNICAL SKILLS', projects: 'PROJECTS', education: 'EDUCATION' },
    jobs: [
      { role: 'CTO', company: 'LOVICI.FR, Guadeloupe, Full-remote', range: 'Nov 2025 - Present', bullets: ["Architected Go/Python backend for e-commerce platform handling product catalog, orders, and payment processing","Designed REST APIs and microservices with independent deployment, enabling parallel team velocity","Implemented CI/CD pipelines with GitHub Actions, Docker, and CloudFlare, reducing release cycle from days to hours","Led code reviews and technical decisions across the engineering team"] },
      { role: 'CTO, Lead Dev & DevOps', company: 'SAHA Technology, Antananarivo, Madagascar', range: 'Jun 2022 - Apr 2025', bullets: ["Led technical team of 5+ frontend and backend developers across multiple product lines","Built production infrastructure with Docker, managing staging and production environments","Recruited, onboarded, and mentored 5+ engineers, establishing coding standards and review processes","Served as primary technical contact for clients, translating business requirements into system architecture"] },
      { role: 'Fullstack Developer (Python)', company: 'Cloud Diodes, US, NY, Full-remote', range: 'Aug 2021 - May 2022', bullets: ["Built SaaS Docker container monitoring dashboard with real-time metrics and alerting using Django and Redis","Automated deployment pipelines and infrastructure provisioning with Bash and Docker Compose"] },
      { role: 'PHP Developer', company: 'Linkeo Madagascar, Antananarivo', range: 'Feb 2021 - Jul 2021', bullets: ["Integrated third-party payment gateway into existing PHP application, reducing checkout friction","Maintained and refactored legacy Symfony codebase, improving page load times"] },
      { role: 'SysAdmin & Developer', company: 'SIR Madagascar SARL, Ambohidratrimo', range: 'Feb 2014 - Jan 2021', bullets: ["Managed Linux server infrastructure (Ubuntu/Debian), network administration, and security hardening","Developed automation scripts for backups, deployments, and monitoring, reducing manual ops by 40%","Built internal tools and web applications for business operations"] },
    ],
    skills: [
      { label: 'Languages', items: 'Go, Python, Dart, SQL, Bash, JavaScript' },
      { label: 'Frameworks', items: 'Go Gin, Django, DRF, Flutter, Vue.js, Celery, Redis' },
      { label: 'APIs', items: 'REST, GraphQL, gRPC, WebSockets' },
      { label: 'Cloud & DevOps', items: 'Docker, GitHub Actions, CloudFlare, NGINX' },
      { label: 'Databases', items: 'PostgreSQL, MySQL, SQLite, GORM, SQLAlchemy' },
    ],
    projects: [
      { name: 'Marketplace Manager', tech: 'Go, Vue.js, PostgreSQL, Docker', desc: 'Multi-marketplace management app (PrestaShop, Amazon) : Go backend, Vue.js frontend, PostgreSQL, distributed as Windows executable' },
      { name: 'hStream', tech: 'Go, Gin, FFmpeg, Redis', desc: 'HLS video streaming server with AES-128 encryption, automatic transcoding, and Docker deployment' },
      { name: 'ElderConnect', tech: 'Django, DRF, Flutter, WebSocket', desc: 'Multi-device platform (box, mobile, web) connecting elderly people with caregivers : real-time updates via WebSocket' },
      { name: 'EduStream', tech: 'Django, Celery, Docker, Redis', desc: 'Educational streaming platform with offline playback, background processing with Celery, and AES-128 encryption' },
      { name: 'dj', tech: 'Go, Docker, Django', desc: 'CLI helper for Django + uv : scaffold, manage, and deploy Django projects from the terminal' },
      { name: 'kpz', tech: 'Go, DevOps, HTTPS', desc: 'DevOps CLI toolkit for local HTTPS subdomain routing with automatic TLS certificates' },
    ],
    education: [
      { school: 'ISM Advancea', degree: 'DTS Informatique', major: 'Software Engineering', range: '2012 - 2014' },
    ],
  },
};

function buildHTML(d, locale) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://cdn.jsdelivr.net/npm/computer-modern/cmu-serif.css');
  @page { size: A4; margin: 20mm 22mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'CMU Serif', 'Computer Modern', 'Latin Modern Roman', 'Georgia', serif;
    font-size: 11pt; color: #1a1a1a; line-height: 1.45;
  }
  h1 { font-size: 22pt; font-weight: 700; color: #000; margin-bottom: 2pt; }
  .role { font-size: 13pt; color: #555; margin-bottom: 4pt; }
  .contact { font-size: 11pt; color: #666; margin-bottom: 1pt; }
  .social { font-size: 10pt; color: #888; font-style: italic; margin-bottom: 6pt; }
  hr.top { border: none; border-top: 0.5pt solid #000; margin-bottom: 8pt; }
  h2 { font-size: 12pt; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4pt; margin-top: 8pt; margin-bottom: 2pt; }
  hr.sec { border: none; border-top: 0.3pt solid #999; margin-bottom: 4pt; }
  .profile { font-size: 9.5pt; color: #333; margin-bottom: 6pt; line-height: 1.45; }
  .contact a, .social a { color: inherit; text-decoration: none; }
  .contact a:hover, .social a:hover { text-decoration: underline; }
  .job { margin-bottom: 5pt; }
  .job-top { display: flex; justify-content: space-between; }
  .job-role { font-size: 11pt; font-weight: 700; }
  .job-date { font-size: 10pt; color: #888; }
  .job-co { font-size: 10pt; font-style: italic; color: #555; margin-bottom: 2pt; }
  ul { list-style: none; padding-left: 12pt; }
  li { font-size: 10pt; color: #333; margin-bottom: 1pt; line-height: 1.35; position: relative; }
  li::before { content: "\\2022"; position: absolute; left: -8pt; color: #666; font-size: 7pt; }
  hr.thin { border: none; border-top: 0.1pt solid #ccc; margin: 4pt 0; }
  .sk { font-size: 10pt; margin-bottom: 1pt; }
  .sk b { color: #222; }
  .sk span { color: #444; }
  .proj { margin-bottom: 4pt; }
  .proj-top { display: flex; justify-content: space-between; }
  .proj-name { font-size: 10.5pt; font-weight: 700; }
  .proj-tech { font-size: 9pt; color: #999; }
  .proj-desc { font-size: 9.5pt; color: #333; }
  hr.tiny { border: none; border-top: 0.1pt solid #ddd; margin: 3pt 0; }
  .edu { margin-bottom: 4pt; }
  .edu-top { display: flex; justify-content: space-between; }
  .edu-sch { font-size: 11pt; font-weight: 700; }
  .edu-date { font-size: 10pt; color: #888; }
  .edu-deg { font-size: 10.5pt; font-style: italic; color: #555; }
  .edu-maj { font-size: 9.5pt; font-style: italic; color: #888; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
  <h1>${site.firstName} ${site.lastName}</h1>
  <div class="role">${d.role}</div>
  <div class="contact">${site.email}  ·  ${site.phone}  ·  <a href="https://hantsaniala.is-a.dev">hantsaniala.is-a.dev</a></div>
  <div class="social"><a href="https://${site.linkedin}">${site.linkedin}</a>  ·  <a href="https://${site.github}">${site.github}</a></div>
  <hr class="top">

  <h2>${d.sections.experience}</h2><hr class="sec">
  ${d.jobs.map((j,i) => `
    <div class="job">
      <div class="job-top"><span class="job-role">${j.role}</span><span class="job-date">${j.range}</span></div>
      <div class="job-co">${j.company}</div>
      <ul>${j.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
    ${i < d.jobs.length-1 ? '<hr class="thin">' : ''}
  `).join('')}

  <h2>${d.sections.projects}</h2><hr class="sec">
  ${d.projects.map((p,i) => {
    const breakBefore = (locale === 'fr' && p.name === 'EduStream') || (locale === 'en' && p.name === 'ElderConnect');
    return `
    <div class="proj${breakBefore ? ' page-break' : ''}">
      <div class="proj-top"><span class="proj-name">${p.name}</span><span class="proj-tech">${p.tech}</span></div>
      <div class="proj-desc">${p.desc}</div>
    </div>
    ${i < d.projects.length-1 ? '<hr class="tiny">' : ''}
  `;}).join('')}

  <h2>${d.sections.skills}</h2><hr class="sec">
  ${d.skills.map(s => `<div class="sk"><b>${s.label} :</b> <span>${s.items}</span></div>`).join('')}

  <h2>${d.sections.education}</h2><hr class="sec">
  ${d.education.map((e,i) => `
    <div class="edu">
      <div class="edu-top"><span class="edu-sch">${e.school}</span><span class="edu-date">${e.range}</span></div>
      <div class="edu-deg">${e.degree}</div>
      ${e.major ? `<div class="edu-maj">${e.major}</div>` : ''}
    </div>
    ${i < d.education.length-1 ? '<hr class="thin">' : ''}
  `).join('')}
</body>
</html>`;
}

async function generatePDFs() {
  const browser = await chromium.launch();
  const publicDir = path.join(__dirname, '..', 'public');
  for (const [locale, filename] of [['fr', 'CV-Hantsaniala-Eleo.pdf'], ['en', 'Resume-Hantsaniala-Eleo.pdf']]) {
    const page = await browser.newPage();
    await page.setContent(buildHTML(data[locale], locale), { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.pdf({
      path: path.join(publicDir, filename),
      format: 'A4',
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
      printBackground: true,
    });
    await page.close();
    console.log(`Generated: ${filename}`);
  }
  await browser.close();
}
generatePDFs();
