import { Job } from '../types';

const companies = [
  { name: 'Stripe', logo: '💳', industry: 'fintech' },
  { name: 'Vercel', logo: '▲', industry: 'developer tools' },
  { name: 'Figma', logo: '🎨', industry: 'design' },
  { name: 'Notion', logo: '📝', industry: 'productivity' },
  { name: 'Linear', logo: '⚡', industry: 'project management' },
  { name: 'Supabase', logo: '⚡', industry: 'backend' },
  { name: 'Railway', logo: '🚂', industry: 'infrastructure' },
  { name: 'Planetscale', logo: '🪐', industry: 'database' },
  { name: 'Retool', logo: '🔧', industry: 'internal tools' },
  { name: 'PostHog', logo: '🦔', industry: 'analytics' },
  { name: 'Cal.com', logo: '📅', industry: 'scheduling' },
  { name: 'Resend', logo: '📧', industry: 'email' },
  { name: 'Turso', logo: '🗄️', industry: 'database' },
  { name: 'Neon', logo: '💚', industry: 'database' },
  { name: 'Clerk', logo: '🔐', industry: 'auth' },
  { name: 'Liveblocks', logo: '🟦', industry: 'realtime' },
  { name: 'Inngest', logo: '🔮', industry: 'serverless' },
  { name: 'Trigger.dev', logo: '⚙️', industry: 'background jobs' },
  { name: 'Depot', logo: '📦', industry: 'CI/CD' },
  { name: 'Upstash', logo: '🔺', industry: 'serverless' },
  { name: 'Axiom', logo: '📊', industry: 'observability' },
  { name: 'Tinybird', logo: '🐦', industry: 'analytics' },
  { name: 'Mintlify', logo: '📖', industry: 'documentation' },
  { name: 'Dub', logo: '🔗', industry: 'URL shortener' },
  { name: 'Infisical', logo: '🔒', industry: 'secrets management' },
];

const jobTitles: Record<string, string[]> = {
  'frontend': ['Frontend Engineer', 'Senior Frontend Developer', 'React Developer', 'UI Engineer', 'Frontend Architect'],
  'backend': ['Backend Engineer', 'Senior Backend Developer', 'API Engineer', 'Platform Engineer', 'Systems Engineer'],
  'fullstack': ['Full Stack Engineer', 'Senior Full Stack Developer', 'Product Engineer', 'Software Engineer', 'Web Developer'],
  'devops': ['DevOps Engineer', 'Infrastructure Engineer', 'Cloud Engineer', 'SRE', 'Platform Engineer'],
  'data': ['Data Engineer', 'Data Scientist', 'ML Engineer', 'Analytics Engineer', 'Data Platform Engineer'],
  'design': ['Product Designer', 'UX Engineer', 'Design Systems Engineer', 'UI/UX Designer', 'Creative Technologist'],
  'mobile': ['Mobile Engineer', 'iOS Developer', 'Android Developer', 'React Native Developer', 'Mobile Architect'],
  'ai': ['AI Engineer', 'ML Ops Engineer', 'AI/ML Engineer', 'LLM Engineer', 'AI Infrastructure Engineer'],
};

const skillSets: Record<string, string[]> = {
  'frontend': ['React', 'TypeScript', 'Next.js', 'CSS', 'Tailwind CSS', 'Vue.js', 'JavaScript', 'HTML', 'Redux', 'GraphQL'],
  'backend': ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Redis', 'gRPC', 'REST APIs', 'Microservices', 'Docker', 'Kubernetes'],
  'fullstack': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'GraphQL', 'Docker', 'AWS', 'Redis', 'Prisma'],
  'devops': ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Linux', 'Prometheus', 'Grafana', 'Helm', 'GitHub Actions'],
  'data': ['Python', 'SQL', 'Spark', 'Airflow', 'dbt', 'Snowflake', 'Pandas', 'TensorFlow', 'BigQuery', 'Apache Kafka'],
  'design': ['Figma', 'React', 'CSS', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility', 'Storybook', 'Tailwind CSS', 'Framer Motion'],
  'mobile': ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android', 'TypeScript', 'Firebase', 'Redux', 'GraphQL'],
  'ai': ['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'OpenAI API', 'Vector Databases', 'RAG', 'MLOps', 'CUDA', 'Transformers'],
};

const benefits = [
  'Unlimited PTO', 'Remote-first culture', 'Health insurance', '401(k) matching',
  'Learning budget', 'Home office stipend', 'Equity package', 'Annual retreats',
  'Flexible hours', 'Parental leave', 'Mental health support', 'Gym membership',
  'Conference budget', 'Latest MacBook', 'Stock options', 'Team events',
];

const locations = [
  'Remote (US)', 'Remote (Worldwide)', 'Remote (US/Canada)', 'Remote (EMEA)',
  'Remote (Americas)', 'Remote (EU)', 'Remote (Global)', 'Remote (US/EU)',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateSalary(level: string): { min: number; max: number } {
  const ranges: Record<string, [number, number]> = {
    'entry': [70000, 110000],
    'mid': [100000, 150000],
    'senior': [140000, 200000],
    'lead': [170000, 250000],
  };
  const [baseMin, baseMax] = ranges[level] || ranges['mid'];
  const min = baseMin + Math.floor(Math.random() * 20000);
  const max = baseMax + Math.floor(Math.random() * 30000);
  return { min, max };
}

export function generateJobs(field: string, count: number = 50): Job[] {
  const fields = field ? field.split(',').map(f => f.trim().toLowerCase()) : ['fullstack'];
  const jobs: Job[] = [];

  for (let i = 0; i < count; i++) {
    const fieldKey = randomFrom(fields.filter(f => jobTitles[f]) || ['fullstack']);
    const company = randomFrom(companies);
    const title = randomFrom(jobTitles[fieldKey] || jobTitles['fullstack']);
    const skills = skillSets[fieldKey] || skillSets['fullstack'];
    const levels: Array<'entry' | 'mid' | 'senior' | 'lead'> = ['entry', 'mid', 'senior', 'lead'];
    const level = randomFrom(levels);
    const daysAgo = Math.floor(Math.random() * 30);
    const postedDate = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

    const requirements = randomSubset(skills, 3, 6);
    const allSkills = skills;
    const responsibilities = [
      `Build and maintain ${fieldKey} applications using modern technologies`,
      'Collaborate with cross-functional teams to deliver high-quality software',
      'Participate in code reviews and contribute to engineering best practices',
      'Help shape technical direction and architecture decisions',
      'Mentor junior engineers and contribute to team growth',
    ];

    jobs.push({
      id: `job-${i}-${Date.now()}`,
      title,
      company: company.name,
      companyLogo: company.logo,
      location: randomFrom(locations),
      type: 'Full-time',
      salary: generateSalary(level),
      description: `We're looking for a talented ${title} to join our ${company.industry} team. You'll work on cutting-edge products used by thousands of developers worldwide. This is a fully remote position with a competitive salary and amazing benefits.`,
      requirements,
      responsibilities: randomSubset(responsibilities, 3, 5),
      benefits: randomSubset(benefits, 4, 7),
      postedDate,
      tags: [fieldKey, level, ...randomSubset(allSkills, 2, 4)],
      experienceLevel: level,
      matchScore: 0,
      applied: false,
      saved: false,
    });
  }

  return jobs;
}

export function getCompanies() {
  return companies;
}
