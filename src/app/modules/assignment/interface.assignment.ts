import { Model } from 'mongoose';
import { z } from 'zod';
import { IStatus } from '../../interface/globalTypes';
import { assignmentBodyData } from './validation.assignment';

export type IAssignmentFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  serial_number?: number;
  delete?: 'yes' | 'no';
  children?: string;
  isDelete?: string;
  // only
  author?: string;
  category?: string;
  course?: string;
  lesson?: string;
  module?: string;
  milestone?: string;
};

export type IAssignment = z.infer<typeof assignmentBodyData> & {
  isDelete: string;
};

export type AssignmentModel = Model<IAssignment, Record<string, unknown>>;
