import { User } from '../models/User.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { ReferrerProfile } from '../models/ReferrerProfile.js';
import { Job } from '../models/Job.js';
import { ReferralRequest } from '../models/ReferralRequest.js';
import { Application } from '../models/Application.js';
import { Notification } from '../models/Notification.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains records. Skipping seed.');
      return;
    }

    console.log('🌱 Seeding initial demo data for ReferHire...');

    // 1. Create Users
    const candidateUser = await User.create({
      name: 'Aarav Sharma',
      email: 'candidate@referhire.com',
      password: 'password123',
      role: 'CANDIDATE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    const googleReferrer = await User.create({
      name: 'Priya Sundaram',
      email: 'referrer@google.com',
      password: 'password123',
      role: 'REFERRER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });

    const msftReferrer = await User.create({
      name: 'Rohan Mehta',
      email: 'referrer@microsoft.com',
      password: 'password123',
      role: 'REFERRER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    const recruiterUser = await User.create({
      name: 'Elena Rostova',
      email: 'recruiter@techcorp.com',
      password: 'password123',
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    });

    const adminUser = await User.create({
      name: 'Platform Administrator',
      email: 'admin@referhire.com',
      password: 'password123',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    });

    // 2. Candidate Profile
    await CandidateProfile.create({
      userId: candidateUser._id,
      headline: 'Full-Stack MERN Developer | React, Node.js, MongoDB',
      bio: '2+ years of experience building scalable single page applications and cloud microservices. Active open-source contributor.',
      location: 'Bengaluru, India',
      skills: ['react', 'node.js', 'mongodb', 'express', 'javascript', 'typescript', 'git', 'docker', 'tailwind css'],
      experienceYears: 2.5,
      experience: [
        {
          company: 'HyperScale Labs',
          role: 'Junior Full Stack Engineer',
          startDate: '2023-01',
          endDate: 'Present',
          current: true,
          skills: ['React', 'Node.js', 'MongoDB', 'Docker'],
          description: 'Engineered customer dashboards serving 40k+ monthly active users.'
        }
      ],
      education: [
        {
          institution: 'National Institute of Technology',
          degree: 'B.Tech in Computer Science',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: 2019,
          endYear: 2023
        }
      ],
      projects: [
        {
          title: 'ReferHire Marketplace',
          description: 'Full-stack referral engine with dynamic skill matching and real-time candidate pipeline.',
          link: 'https://github.com/example/referhire',
          github: 'https://github.com/example/referhire',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB']
        }
      ],
      portfolio: 'https://aarav-dev.portfolio.io',
      github: 'https://github.com/aarav-sharma',
      linkedin: 'https://linkedin.com/in/aarav-sharma-dev',
      availability: 'IMMEDIATE'
    });

    // 3. Referrer Profiles
    await ReferrerProfile.create({
      userId: googleReferrer._id,
      companyName: 'Google',
      companyEmail: 'priyas@google.com',
      isCompanyVerified: true,
      role: 'Senior Staff Software Engineer',
      department: 'Google Cloud & Infrastructure',
      totalReferralsProvided: 14,
      successfulHires: 4,
      rating: 4.95,
      referralCriteria: {
        minimumExperienceYears: 2,
        preferredSkills: ['node.js', 'go', 'distributed systems', 'kubernetes', 'react'],
        customNotes: 'I actively refer engineers for Google Cloud, Core Search, and YouTube teams. Please share your GitHub.'
      }
    });

    await ReferrerProfile.create({
      userId: msftReferrer._id,
      companyName: 'Microsoft',
      companyEmail: 'rohanm@microsoft.com',
      isCompanyVerified: true,
      role: 'Principal Engineering Lead',
      department: 'Azure Developer Experience',
      totalReferralsProvided: 22,
      successfulHires: 6,
      rating: 4.88,
      referralCriteria: {
        minimumExperienceYears: 1,
        preferredSkills: ['react', 'typescript', 'c#', 'azure', 'node.js'],
        customNotes: 'Hiring actively for Azure and GitHub integration tools in Hyderabad and Bangalore.'
      }
    });

    // 4. Jobs
    const jobs = await Job.create([
      {
        title: 'MERN Stack Developer',
        companyName: 'Google',
        postedBy: recruiterUser._id,
        workMode: 'REMOTE',
        jobType: 'FULL_TIME',
        location: 'Bengaluru / Remote',
        salary: { min: 1400000, max: 2400000, currency: 'INR', period: 'YEARLY' },
        experience: { min: 2, max: 5 },
        skills: ['react', 'node.js', 'mongodb', 'express', 'git', 'docker'],
        description: 'Join Google Cloud Developer Experience team to build web applications, internal developer tools, and customer portals.',
        requirements: [
          'Proficiency with React, Node.js, and Express REST APIs',
          'Experience building performant MongoDB aggregations and schema models',
          'Good understanding of Docker and CI/CD pipelines'
        ],
        benefits: ['Comprehensive health coverage', 'Work from home stipend', 'Annual learning budget', 'Stock grants'],
        allowReferrals: true,
        applicationCount: 1,
        referralRequestCount: 1
      },
      {
        title: 'Frontend Engineer (React + TypeScript)',
        companyName: 'Microsoft',
        postedBy: recruiterUser._id,
        workMode: 'HYBRID',
        jobType: 'FULL_TIME',
        location: 'Hyderabad, India',
        salary: { min: 1800000, max: 2800000, currency: 'INR', period: 'YEARLY' },
        experience: { min: 2, max: 6 },
        skills: ['react', 'typescript', 'css', 'redux', 'jest', 'git'],
        description: 'Help engineer next-generation Azure Portal tools and responsive component design systems.',
        requirements: [
          '3+ years with modern React, Hooks, and TypeScript',
          'Obsession with UI accessibility, design system tokens, and web performance',
          'Experience writing comprehensive Jest / React Testing Library unit tests'
        ],
        benefits: ['Hybrid work model (3 days onsite)', 'Wellness subsidies', 'Generous paid parental leave'],
        allowReferrals: true
      },
      {
        title: 'Senior Backend Engineer (Node.js & Microservices)',
        companyName: 'Stripe',
        postedBy: recruiterUser._id,
        workMode: 'REMOTE',
        jobType: 'FULL_TIME',
        location: 'Remote, India',
        salary: { min: 2600000, max: 4000000, currency: 'INR', period: 'YEARLY' },
        experience: { min: 4, max: 8 },
        skills: ['node.js', 'mongodb', 'redis', 'kafka', 'distributed systems', 'docker'],
        description: 'Architect resilient financial ledger services handling millions of transactions daily.',
        requirements: [
          'Deep expertise in Node.js event loop, asynchronous IO, and high-throughput databases',
          'Hands-on experience with Redis caching and event-driven architectures',
          'Focus on security, idempotency, and high availability'
        ],
        benefits: ['Top of market compensation', 'Remote-first culture', 'Health & wellness perks'],
        allowReferrals: true
      },
      {
        title: 'Full Stack Engineer (React + Python/Node)',
        companyName: 'Anthropic AI',
        postedBy: recruiterUser._id,
        workMode: 'REMOTE',
        jobType: 'FULL_TIME',
        location: 'Bengaluru / Remote',
        salary: { min: 2200000, max: 3500000, currency: 'INR', period: 'YEARLY' },
        experience: { min: 2, max: 5 },
        skills: ['react', 'node.js', 'python', 'fastapi', 'tailwind css', 'git'],
        description: 'Build user-facing AI interfaces, generative workflows, and agentic workspace tools.',
        requirements: [
          'Strong full-stack capabilities with React and Node or Python',
          'Passionate about AI interfaces, streaming responses, and responsive designs'
        ],
        benefits: ['Cutting edge AI stack', 'Equity participation', 'Equipment allowance'],
        allowReferrals: true
      }
    ]);

    // 5. Seed an active referral request
    const sampleReferral = await ReferralRequest.create({
      jobId: jobs[0]._id,
      candidateId: candidateUser._id,
      referrerId: googleReferrer._id,
      companyName: 'Google',
      pitchMessage: 'Hi Priya! I have 2+ years of experience in MERN stack development and built high-performance dashboards with 40k+ users. I would be thrilled to be referred for the MERN Stack Developer role.',
      resumeUrl: 'https://example.com/aarav_sharma_resume.pdf',
      skillsMatchScore: 85,
      status: 'PENDING'
    });

    // 6. Seed Notifications
    await Notification.create({
      recipientId: candidateUser._id,
      senderId: googleReferrer._id,
      type: 'REFERRAL_REQUEST_RECEIVED',
      title: 'Referral Request Sent',
      message: 'Your referral request for MERN Stack Developer at Google has been sent to Priya Sundaram.',
      link: '/candidate/dashboard'
    });

    await Notification.create({
      recipientId: googleReferrer._id,
      senderId: candidateUser._id,
      type: 'REFERRAL_REQUEST_RECEIVED',
      title: 'Incoming Referral Request',
      message: 'Aarav Sharma requested a referral for MERN Stack Developer (85% Match).',
      link: '/referrer/dashboard'
    });

    console.log('✅ Demo database seeded successfully with 4 roles, profiles, jobs, and referral workflows!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
