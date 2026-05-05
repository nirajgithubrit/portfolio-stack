export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
  status: 'completed' | 'live';
  role: 'frontend' | 'fullstack';
  duration: string;
  featured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  order: number;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: { id: string; email: string; role: string };
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface SiteSettings {
  fullName: string;
  headline: string;
  taglineLines: string[];
  aboutSummary: string;
  locationLabel: string;
  profilePhotoUrl: string;
  logoUrl: string;
  resumeUrl: string;
  contactEmail: string;
  phone: string;
  timezone: string;
  socials: SocialLink[];
  heroStats: string[];
  seoTitle: string;
  seoDescription: string;
  themeId: string;
}
