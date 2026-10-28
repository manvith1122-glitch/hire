/**
 * ReferHire Smart Matching Engine
 * Compares candidate profile skills and experience against job requisitions.
 */
export const calculateSkillMatch = (jobSkills = [], candidateSkills = [], jobMinExp = 0, candidateExp = 0) => {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      matchScore: 100,
      matchedSkills: [],
      missingSkills: [],
      experienceMet: true
    };
  }

  // Normalize skill arrays
  const cleanJobSkills = jobSkills.map(s => String(s).trim().toLowerCase());
  const cleanCandidateSkills = new Set(candidateSkills.map(s => String(s).trim().toLowerCase()));

  const matchedSkills = [];
  const missingSkills = [];

  cleanJobSkills.forEach(skill => {
    // Check direct equality or partial match
    const hasSkill = Array.from(cleanCandidateSkills).some(cSkill => 
      cSkill === skill || cSkill.includes(skill) || skill.includes(cSkill)
    );

    if (hasSkill) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Base score from skills
  let score = Math.round((matchedSkills.length / cleanJobSkills.length) * 100);

  // Experience evaluation
  const experienceMet = candidateExp >= jobMinExp;

  // Small bonus or penalty for experience
  if (experienceMet && score > 0) {
    score = Math.min(100, score + 5);
  } else if (!experienceMet && score > 15) {
    score = Math.max(0, score - 10);
  }

  return {
    matchScore: score,
    matchedSkills,
    missingSkills,
    experienceMet
  };
};
