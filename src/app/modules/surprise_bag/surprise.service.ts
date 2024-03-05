import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import { ISurpriseBag } from './surprise.interface';
import { SurpriseBag } from './surprise.model';

const createSurpriseBagToDB = async (
  bag: ISurpriseBag,
): Promise<ISurpriseBag | null> => {
  const surpriseBag = await SurpriseBag.create(bag);
  if (!surpriseBag) {
    throw new ApiError(400, 'Failed to create surprise bag');
  }
  return surpriseBag;
};

const getAllSurpriseBagsFromDB = async (): Promise<ISurpriseBag[] | null> => {
  const surpriseBags = await SurpriseBag.find({});
  if (!surpriseBags) {
    throw new ApiError(400, 'Failed to get surprise bags');
  }
  return surpriseBags;
};

const updateSurpriseBagFromDB = async (
  id: string,
  bag: ISurpriseBag,
): Promise<ISurpriseBag | null> => {
  const surpriseBag = await SurpriseBag.findByIdAndUpdate({ _id: id }, bag, {
    new: true,
  });
  if (!surpriseBag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Failed to update surprise bag');
  }
  return surpriseBag;
};

const getSingleSurpriseBagFromDB = async (
  id: string,
): Promise<ISurpriseBag | null> => {
  const surpriseBag = await SurpriseBag.findById({ _id: id });
  if (!surpriseBag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Surprise bag not found');
  }
  return surpriseBag;
};

const deleteSurpriseBagFromDB = async (
  id: string,
): Promise<ISurpriseBag | null> => {
  const surpriseBag = await SurpriseBag.findByIdAndDelete({ _id: id });
  if (!surpriseBag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Surprise bag not found');
  }
  return surpriseBag;
};

export const SurpriseBagService = {
  createSurpriseBagToDB,
  getAllSurpriseBagsFromDB,
  updateSurpriseBagFromDB,
  getSingleSurpriseBagFromDB,
  deleteSurpriseBagFromDB,
};
