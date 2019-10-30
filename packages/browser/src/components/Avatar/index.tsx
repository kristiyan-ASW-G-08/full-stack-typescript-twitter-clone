import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvatarWrapper, IconContainer } from './styled';

interface AvatarProps {
  avatarURL?: string;
  size?: 'small' | 'medium' | 'large';
  altText?: string;
}
export const Avatar: FC<AvatarProps> = ({
  avatarURL,
  size = 'small',
  altText = 'avatar',
}) => (
  <AvatarWrapper size={size}>
    {avatarURL ? (
      <img src={avatarURL} alt={altText} />
    ) : (
      <IconContainer size={size}>
        <FontAwesomeIcon icon="user-circle" />
      </IconContainer>
    )}
  </AvatarWrapper>
);

export default memo(Avatar);
