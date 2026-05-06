import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { SiteSettings } from '../models/SiteSettings.js';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

const adminEmail = (process.env.ADMIN_SEED_EMAIL ?? 'sataniniraj0000@gmail.com').toLowerCase();
const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? 'Niraj.portfolio@0503';

await connectDb(mongoUri);

await User.deleteMany({ email: adminEmail });
const passwordHash = await bcrypt.hash(adminPassword, 10);
await User.create({ email: adminEmail, passwordHash, role: 'admin' });
console.log('Seeded admin:', adminEmail);

await Project.deleteMany({});
await Project.insertMany([
  {
    title: 'Portfolio Stack',
    slug: 'portfolio-stack',
    summary: 'Full-stack portfolio with Angular and Express.',
    description: 'Monorepo featuring JWT admin, MongoDB, and a responsive public site.',
    imageUrl: '',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    techStack: ['Angular', 'Node.js', 'MongoDB', 'Tailwind'],
    status: 'live',
    role: 'fullstack',
    duration: 'Jan 2025 - Mar 2025',
    featured: true,
    order: 0,
  },
  {
    title: 'REST Task API',
    slug: 'rest-task-api',
    summary: 'CRUD API with auth middleware.',
    description: 'Express routes with Mongoose models and structured error responses.',
    githubUrl: 'https://github.com',
    liveUrl: '',
    techStack: ['Express', 'JWT', 'Mongoose'],
    status: 'completed',
    role: 'fullstack',
    duration: 'Oct 2024 - Dec 2024',
    featured: true,
    order: 1,
  },
  {
    title: 'Dashboard UI',
    slug: 'dashboard-ui',
    summary: 'Admin tables and forms for content.',
    description: 'Protected Angular routes with interceptors and reactive forms.',
    githubUrl: 'https://github.com',
    liveUrl: '',
    techStack: ['Angular', 'Tailwind'],
    status: 'completed',
    role: 'frontend',
    duration: 'Aug 2024 - Sep 2024',
    featured: false,
    order: 2,
  },
  {
    title: 'Analytics Widget',
    slug: 'analytics-widget',
    summary: 'Charts and KPIs for internal tools.',
    description: 'Lightweight charts with animated progress indicators.',
    githubUrl: '',
    liveUrl: 'https://example.com',
    techStack: ['TypeScript', 'RxJS'],
    status: 'live',
    role: 'frontend',
    duration: 'Apr 2024 - Jun 2024',
    featured: false,
    order: 3,
  },
]);

await Skill.deleteMany({});
await Skill.insertMany([
  { name: 'Angular', category: 'Frontend', proficiency: 92, order: 0 },
  { name: 'TypeScript', category: 'Languages', proficiency: 90, order: 1 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 88, order: 2 },
  { name: 'Node.js', category: 'Backend', proficiency: 85, order: 3 },
  { name: 'Express', category: 'Backend', proficiency: 84, order: 4 },
  { name: 'MongoDB', category: 'Data', proficiency: 80, order: 5 },
  { name: 'REST APIs', category: 'Backend', proficiency: 88, order: 6 },
  { name: 'JWT / Auth', category: 'Security', proficiency: 82, order: 7 },
  { name: 'Docker', category: 'DevOps', proficiency: 70, order: 8 },
  { name: 'Git', category: 'Tools', proficiency: 90, order: 9 },
]);

await Experience.deleteMany({});
const now = new Date();
await Experience.insertMany([
  {
    company: 'Tech Corp',
    title: 'Full Stack Developer',
    location: 'Remote',
    startDate: new Date(now.getFullYear() - 2, 0, 1),
    endDate: null,
    description: 'Building web apps with Angular and Node services.',
    order: 0,
  },
  {
    company: 'Startup Labs',
    title: 'Software Engineer',
    location: 'India',
    startDate: new Date(now.getFullYear() - 4, 2, 1),
    endDate: new Date(now.getFullYear() - 2, 0, 1),
    description: 'Feature delivery, API design, and UI polish.',
    order: 1,
  },
  {
    company: 'University Projects',
    title: 'Developer',
    location: '',
    startDate: new Date(now.getFullYear() - 6, 8, 1),
    endDate: new Date(now.getFullYear() - 4, 2, 1),
    description: 'Coursework and open-source contributions.',
    order: 2,
  },
]);

await ContactMessage.deleteMany({});
await ContactMessage.insertMany([
  {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    subject: 'Collaboration',
    message: 'Loved your portfolio — let us connect for a short call.',
    read: false,
  },
  {
    name: 'Jamie Lee',
    email: 'jamie@example.com',
    subject: 'Freelance inquiry',
    message: 'Do you take on small MVP builds?',
    read: true,
  },
]);

await SiteSettings.deleteMany({});
await SiteSettings.create({
  fullName: 'Nirajkumar Satani',
  headline: 'Full Stack Developer',
  taglineLines: ['Angular · Node · MongoDB', 'APIs, auth, and polished UI', 'From concept to production'],
  aboutSummary:
    'I am a full-stack developer focused on scalable APIs, clean architecture, and modern UI experiences.',
  locationLabel: 'Ahmedabad, Gujarat, India',
  profilePhotoUrl: '/profile.png',
  logoUrl: '/logo.png',
  resumeUrl: '/resume.pdf',
  contactEmail: 'niraj@example.com',
  phone: '',
  timezone: 'Asia/Kolkata',
  socials: [
    { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { platform: 'X', url: 'https://x.com', icon: 'x' },
  ],
  heroStats: [],
  themeId: 'night',
  seoTitle: 'Nirajkumar Satani · Full Stack Developer',
  seoDescription: 'Portfolio, projects, skills, and contact information.',
});

console.log('Seed complete.');
await mongoose.disconnect();
