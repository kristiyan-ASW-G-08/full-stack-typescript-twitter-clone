import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from 'styled/PageContainer';
import UsersContainer from 'components/UsersContainer';
import Feed from 'types/Feed';
import getUrl from 'utilities/getUrl';

export const UsersPage: FC = () => {
  const { feed, userId } = useParams();
  const [url, setUrl] = useState<string>(getUrl(`/users/${userId}/${feed}`));
  const feeds: Feed[] = [
    {
      url: getUrl(`/users/${userId}/following`),
      name: 'Following',
    },
    {
      url: getUrl(`/users/${userId}/followers`),
      name: 'Followers',
    },
  ];

  return (
    <PageContainer>
      <UsersContainer url={url} setUrl={setUrl} feeds={feeds} />
    </PageContainer>
  );
};
export default UsersPage;
