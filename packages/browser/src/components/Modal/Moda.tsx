import React, { FC, useContext } from 'react';


interface ModalProps {
  type: 'tweetForm';
}
export const Modal: FC<ModalProps> = ({ type }) => {
  const modalComponents = {
    tweetForm: () => <h1>TweetForm</h1>,
  };
  return <div>{modalComponents[type]}</div>;
};
export default Modal;
