import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const experienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ExperienceDocument = InferSchemaType<typeof experienceSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const Experience = mongoose.model('Experience', experienceSchema);
