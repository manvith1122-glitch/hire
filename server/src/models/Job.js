import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      index: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: false, // optional if posted directly with companyName
      index: true
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      index: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workMode: {
      type: String,
      enum: ['REMOTE', 'HYBRID', 'ONSITE'],
      default: 'REMOTE',
      index: true
    },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
      default: 'FULL_TIME'
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
      index: true
    },
    salary: {
      min: { type: Number, default: 800000 },
      max: { type: Number, default: 1800000 },
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['YEARLY', 'MONTHLY'], default: 'YEARLY' }
    },
    experience: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 4 }
    },
    skills: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true
      }
    ],
    description: {
      type: String,
      required: [true, 'Please provide job description']
    },
    requirements: [
      {
        type: String
      }
    ],
    benefits: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['OPEN', 'PAUSED', 'CLOSED'],
      default: 'OPEN',
      index: true
    },
    deadline: {
      type: Date
    },
    allowReferrals: {
      type: Boolean,
      default: true
    },
    department: {
      type: String,
      default: 'Engineering'
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    applicationCount: {
      type: Number,
      default: 0
    },
    referralRequestCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

jobSchema.index({ title: 'text', description: 'text', companyName: 'text', skills: 'text' });
jobSchema.index({ status: 1, workMode: 1, 'experience.min': 1, 'salary.min': 1 });

export const Job = mongoose.model('Job', jobSchema);
