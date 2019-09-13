import mongoose from 'mongoose';

const includesObjectId = (
  arr: mongoose.Types.ObjectId[],
  stringId: string,
): boolean => {
  const id = mongoose.Types.ObjectId(stringId);
  const check = arr.some((includedId: mongoose.Types.ObjectId): boolean => {
    return includedId.equals(id);
  });
  return check;
};

export default includesObjectId;
