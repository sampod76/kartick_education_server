import { Model, Types } from 'mongoose';

export type IMilestoneFilters = {
  searchTerm?: string;
  tile?: number;
  details?: string;

  status?: string;
};

export type IMilestoneSearchableField = {
  title: string;
  details: string;
};

export type IMilestone = {
  title: string;
  img: string;
  details: string;
  course_id: Types.ObjectId;
  status: 'active' | 'deactive';
};

export type MilestoneModel = Model<IMilestone, Record<string, unknown>>;
