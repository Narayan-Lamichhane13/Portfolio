export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'contact';

export interface SectionMeta {
  id: SectionId;
  index: number;
  label: string;
  title: string;
  subtitle: string;
  accent: 'aurora' | 'ember' | 'mist';
}

export const PROFILE = {
  name: 'Narayan Lamichhane',
  shortName: 'Narayan',
  role: 'Computer Science · UIUC',
  school: 'University of Illinois at Urbana-Champaign',
  schoolShort: 'UIUC',
  graduation: 'December 2026',
  location: 'Chicago / Champaign, IL',
  email: 'nara.lami13@gmail.com',
  github: 'https://github.com/Narayan-Lamichhane13',
  linkedin: 'https://www.linkedin.com/in/naralami13/',
  resumeUrl: '/resume/Narayan_Lamichhane_Resume.pdf',
  portrait: '/photos/about-portrait.jpg?v=3',
  tagline: 'Building things that actually help people.',
  intro:
    "I'm Narayan! I like to build things that solve problems and help people. My passion is in product management.",
};

export const SECTIONS: SectionMeta[] = [
  {
    id: 'about',
    index: 1,
    label: 'About Me',
    title: 'About Me',
    subtitle: 'Who I am and how I think.',
    accent: 'aurora',
  },
  {
    id: 'experience',
    index: 2,
    label: 'Experience',
    title: 'Experience',
    subtitle: 'Internships, research, and engineering work.',
    accent: 'ember',
  },
  {
    id: 'projects',
    index: 3,
    label: 'Projects',
    title: 'Projects',
    subtitle: 'Selected things I’ve built — security, ML, and product.',
    accent: 'aurora',
  },
  {
    id: 'contact',
    index: 4,
    label: 'Contact me',
    title: 'Contact me',
    subtitle: "Let's connect.",
    accent: 'mist',
  },
];

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  bullets: string[];
  stack: string[];
  image?: string;
  link?: { href: string; label: string };
  pdf?: { href: string; label: string };
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Software Development Intern',
    company: 'Amazon · Agentic AI for AWS',
    period: 'Summer 2026 (incoming)',
    location: 'Seattle, WA',
    bullets: [
      'Joining the team building agentic AI capabilities for AWS.',
      'Working on tooling that lets AI agents reason about, plan over, and operate on cloud infrastructure.',
      'Focus areas: agent orchestration, observability, and developer experience.',
    ],
    stack: ['AI Agents', 'AWS', 'Distributed Systems', 'TypeScript'],
  },
  {
    role: 'Product Management Intern',
    company: '3Sharp',
    period: 'Jun 2025 — Aug 2025',
    location: 'Seattle, WA',
    bullets: [
      'Built the Azure HERO AI Demo software for Microsoft — published on Microsoft.com during a low-staffing window.',
      'Shipped 15+ interactive B2B showcase systems with 3Sharp and Microsoft.',
      'Resolved 20+ UI/UX issues across the showcase pipeline using PM workflows and Power BI dashboards.',
      'Secured an additional $5K in project budget by surfacing impact metrics to stakeholders.',
    ],
    stack: ['Product', 'Microsoft', 'Azure', 'Power BI', 'UI/UX'],
    link: {
      href: 'https://partner.microsoft.com/en-us/asset/collection/industry-dream-demos-and-dream-demo-in-a-box#/',
      label: 'Microsoft Partner showcase',
    },
  },
  {
    role: 'Lead Software Engineer',
    company: 'SafeFit · Health-tech startup',
    period: '2024 — 2025',
    bullets: [
      'Led engineering on a full-stack health app — React Native client with a Flask back end.',
      'Implemented OWASP Top 10 mitigations across the API surface and authentication flow.',
      'Demoed the product to investors and program mentors; iterated on feedback into the next milestone.',
    ],
    stack: ['React Native', 'Flask', 'Security', 'OWASP'],
    image: '/photos/safefit.png',
  },
  {
    role: 'AI Research Assistant',
    company: 'UIUC · Adversarial ML',
    period: 'Jun 2024 — Aug 2024',
    location: 'Urbana, IL',
    bullets: [
      'Researched adversarial examples — perturbations to images that cause misclassification — and the security implications for production ML.',
      'Led an undergraduate research team analyzing ML vulnerabilities; improved adversarial robustness by ~15% via advanced training techniques.',
      'Secured $2,000 in research funding through a written proposal and stakeholder presentation.',
    ],
    stack: ['Adversarial ML', 'Computer Vision', 'AI Security'],
    pdf: { href: '/photos/research-poster.pdf', label: 'Research poster (PDF)' },
  },
];

export interface AboutCard {
  title: string;
  body: string;
  meta: string;
  image?: string;
  imageCredit?: string;
}

/**
 * Hobby cards rendered on the About page. Cooking, Photography, and Muay
 * Thai use Narayan's own photos; Chess uses a stock image from Unsplash
 * (free for commercial use).
 */
export const HOBBIES: AboutCard[] = [
  {
    title: 'Cooking',
    meta: '01',
    body: 'I love to cook and try foods from different cuisines.',
    image: '/photos/cooking.jpg',
  },
  {
    title: 'Photography',
    meta: '02',
    body: 'I love taking a snap of my adventures.',
    image: '/photos/photography.jpg',
  },
  {
    title: 'Muay Thai',
    meta: '03',
    body: 'Muay Thai is a fun way I exercise.',
    image: '/photos/muay-thai.jpg',
  },
  {
    title: 'Chess',
    meta: '04',
    body: 'I’m addicted — always playing chess.',
    image:
      'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=900&q=80',
    imageCredit: 'Photo: Unsplash',
  },
];

export interface ProjectItem {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  status: 'shipped' | 'in progress' | 'archived';
  year: string;
  image?: string;
  github?: string;
  link?: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    name: 'Tile',
    tagline: 'AirDrop for Windows',
    description:
      'Cross-platform file transfer using TCP/HTTP streaming over local networks. Peer-to-peer sync between iOS and Windows with an LLM copilot for automatic file organization. MVP piloted with 20+ students.',
    tags: ['Networking', 'Windows', 'iOS', 'LLMs'],
    status: 'in progress',
    year: '2026',
    image: '/photos/tile.png',
  },
  {
    name: 'Airify',
    tagline: 'NASA-data air quality platform',
    description:
      'Combines NASA TEMPO satellite data with local pollution and weather feeds to surface real-time air quality. Built for the NASA Space Apps Challenge with feedback from NASA, Google, and IBM.',
    tags: ['Python', 'NASA TEMPO', 'Data', 'Product'],
    status: 'shipped',
    year: '2025',
    image: '/photos/airify.jpg',
    link: 'https://airifyaqi.vercel.app/',
  },
  {
    name: 'Phishing URL Detection',
    tagline: 'Neural network for phishing URLs',
    description:
      'A PyTorch MLP that classifies phishing URLs from feature-engineered data. Includes preprocessing, dropout regularization, training metrics, and evaluation against a held-out set.',
    tags: ['Python', 'PyTorch', 'ML', 'Cybersecurity'],
    status: 'shipped',
    year: '2025',
    github: 'https://github.com/Narayan-Lamichhane13/NN_regression',
  },
  {
    name: 'Advanced Vulnerability Scanner',
    tagline: 'Network scanner with CVE lookup',
    description:
      'An advanced network vulnerability scanner in Python — wraps Nmap, queries the NVD API for CVEs, supports multi-threaded TCP/UDP scanning, and exports findings as structured reports.',
    tags: ['Python', 'Nmap', 'CVE', 'Cybersecurity'],
    status: 'shipped',
    year: '2025',
    github: 'https://github.com/Narayan-Lamichhane13/Vulnerbility-Scanner',
  },
  {
    name: 'SafeFit',
    tagline: 'Secure health-tech app',
    description:
      'Full-stack health app — React Native client with a Flask back end. Implemented OWASP Top 10 mitigations across the API and authentication. Demoed to investors and program mentors.',
    tags: ['React Native', 'Flask', 'OWASP', 'Security'],
    status: 'shipped',
    year: '2024',
    image: '/photos/safefit.png',
  },
];

export interface ContactBlock {
  heading: string;
  items: { label: string; value: string }[];
}

export const CONTACT_BLOCKS: ContactBlock[] = [
  {
    heading: 'Education',
    items: [
      { label: 'University', value: 'University of Illinois Urbana-Champaign' },
      { label: 'Degree', value: 'B.S. Computer Science' },
      { label: 'Graduation', value: 'December 2026' },
      {
        label: 'Focus',
        value: 'Product Management & Software Engineering',
      },
    ],
  },
  {
    heading: 'Highlights',
    items: [
      {
        label: 'Incoming',
        value: 'Software Development Intern · Amazon · Agentic AI for AWS · Summer 2026',
      },
      {
        label: '3Sharp · Microsoft',
        value: 'Built the Azure HERO AI Demo software for Microsoft — published on Microsoft.com',
      },
    ],
  },
];
