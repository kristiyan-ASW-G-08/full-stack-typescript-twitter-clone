import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdvancedImage } from '@cloudinary/react';
import cloudinary from '../../cloudinary';
import { AvatarWrapper, IconContainer } from './styled';

interface AvatarProps {
  avatar?: string;
  size?: 'small' | 'medium' | 'large';
  altText?: string;
}

export const Avatar: FC<AvatarProps> = ({
  avatar,
  size = 'small',
  altText = 'avatar',
}) => {
  const avatarImage = cloudinary.image(avatar);
  return (
    <AvatarWrapper size={size}>
      {avatar !== undefined && typeof avatar === 'string' ? (
        <AdvancedImage cldImg={avatarImage} alt={altText} />
      ) : (
        <IconContainer size={size}>
          <FontAwesomeIcon size="lg" icon="user-circle" />
        </IconContainer>
      )}
    </AvatarWrapper>
  );
};

export default memo(Avatar);
