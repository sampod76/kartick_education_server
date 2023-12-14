
      import { Model, Types } from 'mongoose';
      
      export type IModuleFilters = {
        searchTerm?: string;
        title?: number;
        module_number?: string;
        status?: string;
      };
      
      export type IModuleSearchableField = {
        title: string;
        module_number: string;
        status: string;
        details: string;
      };
      
      export type IModule = {
        title: string;
        img: string;
        details: string;
        module_number: string;
        milestone_id: Types.ObjectId;
        status: 'active' | 'deactive' | 'save';
      };
      
      export type ModuleModel = Model<IModule, Record<string, unknown>>;
      
