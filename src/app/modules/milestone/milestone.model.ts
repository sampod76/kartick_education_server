
      import { Schema, model } from 'mongoose';
import { IMilestone, MilestoneModel } from './milestone.interface';

      
      const MilestoneSchema = new Schema<IMilestone, MilestoneModel>(
        {
       
          title: {
            type: String,
            required: true,
          },
          img: {
            type: String,
            required: true,
          },
          details: {
            type: String,
            required: true,
          },
          course_id: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
          },
          status: {
            type: String,
            enum: ['active', 'deactive'],
            default: 'active',
          },
        },
        {
          timestamps: true,
          // strict: 'throw',
          toJSON: {
            virtuals: true,
          },
        }
      );
      
      export const Milestone = model<IMilestone, MilestoneModel>('Milestone', MilestoneSchema);
      
      
