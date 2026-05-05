import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    status: { type: String, enum: ['completed', 'live'], default: 'completed' },
    role: { type: String, enum: ['frontend', 'fullstack'], default: 'fullstack' },
    duration: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: mongoose.Types.ObjectId };
export const Project = mongoose.model('Project', projectSchema);
