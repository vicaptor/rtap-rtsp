import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnotation extends Document {
  streamId: string;
  timestamp: number;
  type: string;
  data: any;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnnotationSchema: Schema = new Schema({
  streamId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Number,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['marker', 'label', 'bbox', 'polygon', 'comment']
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
AnnotationSchema.index({ streamId: 1, timestamp: 1 });

export default mongoose.model<IAnnotation>('Annotation', AnnotationSchema);
