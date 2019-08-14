import mongoose from 'mongoose';

const includesObjectId = (
  arr: mongoose.Types.ObjectId[],
  stringId: string,
): boolean => {
  const id = mongoose.Types.ObjectId(stringId);
  const check = arr.find((includedId: mongoose.Types.ObjectId): boolean => {
    return id.equals(id);
  });
  return !!check;
};

export default includesObjectId;
