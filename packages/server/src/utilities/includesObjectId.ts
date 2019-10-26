import mongoose from 'mongoose';

const includesObjectId = (
  arr: mongoose.Types.ObjectId[],
  stringId: string,
): boolean => {
  const id = mongoose.Types.ObjectId(stringId);
  const isIncluded = arr.some((includedId: mongoose.Types.ObjectId): boolean =>
    includedId.equals(id),
  );
  return isIncluded;
};

export default includesObjectId;
