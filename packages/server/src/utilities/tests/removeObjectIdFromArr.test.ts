import mongoose from 'mongoose';
import removeObjectIdFromArr from '@utilities/removeId';

describe('removeFromArr', () => {
  const id = mongoose.Types.ObjectId();
  const stringId = id.toString();
  const idArr = [
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
  ];
  it(`should return true`, () => {
    const newIdArr = [...idArr, id];
    const removedIdArr = removeObjectIdFromArr(newIdArr, stringId);
    expect(removedIdArr).toHaveLength(3);
    expect(removedIdArr).toEqual(idArr);
  });
});
