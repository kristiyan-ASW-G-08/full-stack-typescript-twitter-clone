import React, { FC, memo } from 'react';
import { LoaderWrapper, Spinner } from './styled';

export const Loader: FC = () => (
  <LoaderWrapper>
    <Spinner />
  </LoaderWrapper>
);

export default memo(Loader);
