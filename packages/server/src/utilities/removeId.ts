import mongoose from 'mongoose';

const removeId = (
  itemsArr: mongoose.Types.ObjectId[],
  stringId: string,
): mongoose.Types.ObjectId[] => {
  const id = mongoose.Types.ObjectId(stringId);
  const filteredItemsArr = itemsArr.filter(
    (includedObjectId: mongoose.Types.ObjectId): boolean => {
      return !includedObjectId.equals(id);
    },
  );
  return filteredItemsArr;
};

export default removeId;
