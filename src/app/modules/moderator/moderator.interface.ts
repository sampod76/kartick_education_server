import { Model } from 'mongoose';

export type IModerator = {
  name: string;
  profileImage?: string;
  dateOfBirth?: string;
  email: string;
  uid?: string;
  phone: string;
  emergencyphone?: string;
  gender?: 'male' | 'female';
  address?: string;
  designation?: string;
  role: string;
  status?: 'active' | 'deactive';
};

export type ModeratorModel = Model<IModerator, Record<string, unknown>>;

export type IModeratorFilters = {
  searchTerm?: string;
  status?: string;
  email?: string;
  phone?: string;
  emergencyphone?: string;
  gender?: 'male' | 'female';
  designation?: string;
};
