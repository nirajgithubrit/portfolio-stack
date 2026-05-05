import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    proficiency: { type: Number, required: true, min: 0, max: 100 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SkillDocument = InferSchemaType<typeof skillSchema> & { _id: mongoose.Types.ObjectId };
export const Skill = mongoose.model('Skill', skillSchema);
