import { Job, UserProfile } from '../types';

export function generateCoverLetter(job: Job, profile: UserProfile): string {
  const userName = profile.name || 'Candidate';
  const userTitle = profile.title || 'Software Engineer';
  const userSummary = profile.summary || `Experienced ${userTitle} with ${profile.yearsExperience}+ years of experience building scalable applications.`;
  const topSkills = profile.skills
    .sort((a, b) => {
      const levelOrder = { 'expert': 4, 'advanced': 3, 'intermediate': 2, 'beginner': 1 };
      return levelOrder[b.level] - levelOrder[a.level];
    })
    .slice(0, 4)
    .map(s => s.name);

  const matchingSkills = topSkills.filter(skill =>
    job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  );

  const displaySkills = matchingSkills.length > 0 ? matchingSkills : topSkills.slice(0, 3);

  const letter = `Dear Hiring Team at ${job.company},

I am writing to express my strong interest in the ${job.title} position at ${job.company}. As a ${userTitle} with ${profile.yearsExperience}+ years of experience, I am excited about the opportunity to contribute to your team.

${userSummary}

What draws me to ${job.company} is your commitment to innovation in the ${job.tags[0] || 'technology'} space. I am particularly impressed by your team's approach to building products that make a real difference for developers and businesses alike.

In my previous roles, I have developed deep expertise in ${displaySkills.join(', ')}, which aligns well with the requirements for this position. I have a proven track record of:

${job.responsibilities.slice(0, 3).map(r => `• ${r}`).join('\n')}

I am especially excited about this role because it combines my technical skills with the opportunity to work on challenging problems in a remote-first environment. The salary range of $${(job.salary.min / 1000).toFixed(0)}K-$${(job.salary.max / 1000).toFixed(0)}K aligns with my expectations, and I am confident I can deliver significant value to your team.

I would welcome the opportunity to discuss how my experience and skills can contribute to ${job.company}'s continued success. Thank you for considering my application.

Best regards,
${userName}
${profile.email || ''}`;

  return letter;
}
