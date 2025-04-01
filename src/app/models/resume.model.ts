export interface Skill {
  name: string;
  level: string; // Expert, Intermediate, Beginner
  category: string; // Frontend, Backend, Database, etc.
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string[];
  technologies: string[];
}

export interface Project {
  title: string;
  company: string;
  duration: string;
  description: string;
  role: string;
  technologies: string[];
  details: string[];
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
}

export interface Contact {
  phone: string;
  email: string;
  linkedin: string;
}

export interface Resume {
  name: string;
  title: string;
  summary: string[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  contact: Contact;
}
