import mongoose from 'mongoose';
import includesObjectId from '../../utilities/includesObjectId';

describe('includesObjectId', (): void => {
  const id = mongoose.Types.ObjectId();
  const stringId = id.toString();
  const idArr = [
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
    mongoose.Types.ObjectId(),
  ];
  it(`should return true if the array includes the objectId`, (): void => {
    const newIdArr = [...idArr, id];
    expect(includesObjectId(newIdArr, stringId)).toBeTruthy();
  });
  it(`should return false if the array doesn't include the objectId`, (): void => {
    const newIdArr = [...idArr];
    expect(includesObjectId(newIdArr, stringId)).toBeFalsy();
  });
});
