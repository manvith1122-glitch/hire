import mongoose from 'mongoose';

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    headline: {
      type: String,
      default: 'Software Engineer',
      trim: true
    },
    bio: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
      trim: true,
      index: true
    },
    skills: [
      {
        type: String,
        lowercase: true,
        trim: true
      }
    ],
    experienceYears: {
      type: Number,
      default: 2,
      min: 0
    },
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        skills: [{ type: String }],
        description: { type: String }
      }
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        startYear: { type: Number },
        endYear: { type: Number }
      }
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        link: { type: String },
        github: { type: String },
        technologies: [{ type: String }]
      }
    ],
    resume: {
      url: { type: String, default: '' },
      fileName: { type: String, default: '' },
      parsedSkills: [{ type: String }],
      uploadedAt: { type: Date }
    },
    portfolio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    availability: {
      type: String,
      enum: ['IMMEDIATE', '15_DAYS', '1_MONTH', 'NOT_LOOKING'],
      default: 'IMMEDIATE'
    }
  },
  {
    timestamps: true
  }
);

candidateProfileSchema.index({ skills: 1, location: 1, experienceYears: 1 });

export const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);
