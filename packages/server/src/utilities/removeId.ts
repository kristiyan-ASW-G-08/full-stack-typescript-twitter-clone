import mongoose from 'mongoose';

const removeId = (
  itemsArr: mongoose.Types.ObjectId[],
  stringId: string,
): mongoose.Types.ObjectId[] =>
  itemsArr.filter(
    (id: mongoose.Types.ObjectId): boolean =>
      !id.equals(mongoose.Types.ObjectId(stringId)),
  );

export default removeId;
