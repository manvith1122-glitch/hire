import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      unique: true,
      trim: true,
      index: true
    },
    logo: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    industry: {
      type: String,
      default: 'Technology & Internet'
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
      default: '201-1000'
    },
    headquarters: {
      type: String,
      default: 'Bengaluru, India'
    },
    description: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    recruiters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Company = mongoose.model('Company', companySchema);
