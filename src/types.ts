
export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Domain';
}

export interface UserProfile {
  name: string;
  headline: string;
  skills: Skill[];
  experienceSummary: string;
}

export interface SkillGap {
  skill: string;
  importance: number; // 1-10
  currentLevel: string;
  requiredLevel: string;
  gapDescription: string;
}

export interface RoadmapTask {
  day: number;
  title: string;
  description: string;
  resources: string[];
  category: 'Learn' | 'Build' | 'Network' | 'Review';
}

export interface Roadmap {
  week: number;
  focus: string;
  tasks: RoadmapTask[];
  checkpoint: string;
}

export interface FutureOutlook {
  roleEvolution: string;
  demandTrend: string;
  newSkillsEmerging: string[];
  aiImpact: string;
  salaryProjection: string;
}

export interface AnalysisResult {
  userProfile: UserProfile;
  skillGaps: SkillGap[];
  roadmap: Roadmap[];
  futureOutlook: FutureOutlook;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface JuniorDiscoveryResult {
  recommendedPaths: {
    title: string;
    description: string;
    preReqs: string[];
  }[];
  advice: string;
}
