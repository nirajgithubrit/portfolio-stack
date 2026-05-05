import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    taglineLines: { type: [String], default: [] },
    aboutSummary: { type: String, required: true, trim: true },
    locationLabel: { type: String, default: '', trim: true },
    profilePhotoUrl: { type: String, default: '', trim: true },
    logoUrl: { type: String, default: '', trim: true },
    resumeUrl: { type: String, default: '', trim: true },
    contactEmail: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    timezone: { type: String, default: '', trim: true },
    socials: { type: [socialLinkSchema], default: [] },
    heroStats: { type: [String], default: [] },
    seoTitle: { type: String, default: '', trim: true },
    seoDescription: { type: String, default: '', trim: true },
    themeId: {
      type: String,
      enum: ['night', 'daylight', 'ocean', 'forest', 'sunset'],
      default: 'night',
    },
  },
  { timestamps: true }
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
