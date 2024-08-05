import { Model } from 'mongoose';
import { z } from 'zod';
import { IStatus } from '../../interface/globalTypes';
import { submitAssignmentBodyData } from './validation.submit_assignment';

export type ISubmitAssignmentFilters = {
  searchTerm?: string;
  title?: string;
  status?: IStatus;
  serial_number?: number;
  delete?: 'yes' | 'no';
  children?: string;
  isDelete?: string;
  // only
  author?: string;
  accountCreateAuthor?: string;
  authorEmail?: string;
  //
  assignment?: string;
  category?: string;
  course?: string;
  lesson?: string;
  module?: string;
  milestone?: string;
};

export type ISubmitAssignment = z.infer<typeof submitAssignmentBodyData> & {
  isDelete: string;
};

export type SubmitAssignmentModel = Model<
  ISubmitAssignment,
  Record<string, unknown>
>;
