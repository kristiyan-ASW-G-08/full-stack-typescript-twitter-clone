import TweetFormProps from 'types/TweetFormProps';

export default interface ModalState {
  isActive: boolean;
  tweetFormProps: TweetFormProps;
  type: 'tweetForm' | 'profileForm';
}
