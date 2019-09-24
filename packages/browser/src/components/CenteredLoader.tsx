import React, { FC } from 'react';
import PageContainer from 'styled/PageContainer';
import Loader from 'styled/Loader';

export const CenteredLoader: FC = () => {
  return (
    <PageContainer>
      <Loader />
    </PageContainer>
  );
};
export default CenteredLoader;
