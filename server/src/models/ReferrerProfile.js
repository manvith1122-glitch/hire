import mongoose from 'mongoose';

const referrerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      index: true
    },
    companyEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    isCompanyVerified: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      required: [true, 'Please provide your current role/title'],
      trim: true
    },
    department: {
      type: String,
      default: 'Engineering',
      trim: true
    },
    totalReferralsProvided: {
      type: Number,
      default: 0
    },
    successfulHires: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5
    },
    referralCriteria: {
      minimumExperienceYears: { type: Number, default: 1 },
      preferredSkills: [{ type: String }],
      customNotes: { type: String, default: 'Please include your resume and relevant GitHub / live project links.' }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const ReferrerProfile = mongoose.model('ReferrerProfile', referrerProfileSchema);
