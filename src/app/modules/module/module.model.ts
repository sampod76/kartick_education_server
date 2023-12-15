
      import { Schema, model } from 'mongoose';
import { IModule, ModuleModel } from './module.interface';

      
      const ModuleSchema = new Schema<IModule, ModuleModel>(
        {
          title: {
            type: String,
            required: true,
          },
          module_number: {
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
        
          milestone_id: {
            type: Schema.Types.ObjectId,
            ref: 'Milestone',
            required: true,
          },
          status: {
            type: String,
            enum: ['active', 'deactive','save'],
            required: true,
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
      
      export const Module = model<IModule, ModuleModel>('Module', ModuleSchema);
      
      
