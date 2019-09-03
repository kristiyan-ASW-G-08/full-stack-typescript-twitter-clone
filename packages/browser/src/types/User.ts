import CommonUser from '@twtr/common/source/types/user';
import SourceRef from 'types/SourceRef';

export default interface User extends CommonUser {
  following: string[];
  likes: SourceRef[];
  bookmarks: SourceRef[];
}
