import { Job, UserProfile, Skill } from '../types';

export function calculateMatchScore(job: Job, profile: UserProfile): number {
  if (!profile.skills.length && !profile.desiredRoles.length) return 0;

  let score = 0;
  let maxScore = 0;

  // Skill match (40% weight)
  const userSkillNames = profile.skills.map(s => s.name.toLowerCase());
  const jobReqNames = job.requirements.map(r => r.toLowerCase());
  const jobTagNames = job.tags.map(t => t.toLowerCase());
  const allJobKeywords = [...jobReqNames, ...jobTagNames];

  maxScore += 40;
  const matchedSkills = userSkillNames.filter(skill =>
    allJobKeywords.some(keyword => keyword.includes(skill) || skill.includes(keyword))
  );
  const skillMatchRatio = jobReqNames.length > 0
    ? matchedSkills.length / jobReqNames.length
    : 0;
  score += skillMatchRatio * 40;

  // Experience level match (20% weight)
  maxScore += 20;
  const expLevelMap: Record<string, number> = { 'entry': 1, 'mid': 2, 'senior': 3, 'lead': 4 };
  const userLevel = profile.yearsExperience <= 2 ? 1 : profile.yearsExperience <= 5 ? 2 : profile.yearsExperience <= 8 ? 3 : 4;
  const jobLevel = expLevelMap[job.experienceLevel] || 2;
  const levelDiff = Math.abs(userLevel - jobLevel);
  score += Math.max(0, 20 - levelDiff * 8);

  // Salary match (20% weight)
  maxScore += 20;
  if (profile.desiredSalaryMin > 0 && profile.desiredSalaryMax > 0) {
    const jobMidSalary = (job.salary.min + job.salary.max) / 2;
    const userMidSalary = (profile.desiredSalaryMin + profile.desiredSalaryMax) / 2;
    const salaryDiff = Math.abs(jobMidSalary - userMidSalary) / userMidSalary;
    score += Math.max(0, 20 - salaryDiff * 30);
  } else {
    score += 15; // neutral if no salary preference
  }

  // Role/title match (20% weight)
  maxScore += 20;
  const jobTitleLower = job.title.toLowerCase();
  const roleMatch = profile.desiredRoles.some(role => {
    const roleLower = role.toLowerCase();
    return jobTitleLower.includes(roleLower) || roleLower.includes(jobTitleLower.split(' ')[0]);
  });
  if (roleMatch) score += 20;
  else if (profile.desiredRoles.length === 0) score += 10;

  return Math.round(Math.min(100, (score / maxScore) * 100));
}

export function getMatchLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Excellent Match', color: 'text-green-600' };
  if (score >= 70) return { label: 'Great Match', color: 'text-emerald-600' };
  if (score >= 55) return { label: 'Good Match', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Fair Match', color: 'text-amber-600' };
  return { label: 'Low Match', color: 'text-red-500' };
}

export function getMatchBgColor(score: number): string {
  if (score >= 85) return 'bg-green-50 border-green-200';
  if (score >= 70) return 'bg-emerald-50 border-emerald-200';
  if (score >= 55) return 'bg-blue-50 border-blue-200';
  if (score >= 40) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function getSkillLevelValue(level: Skill['level']): number {
  const map = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
  return map[level];
}
