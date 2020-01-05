import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from 'styled/PageContainer';
import UsersContainer from 'components/UsersContainer';
import Feed from 'types/Feed';

export const UsersPage: FC = () => {
  const { feed, userId } = useParams();
  const { REACT_APP_API_URL } = process.env;
  const [url, setUrl] = useState<string>(
    `${REACT_APP_API_URL}/users/${userId}/${feed}`,
  );
  const feeds: Feed[] = [
    {
      url: `${REACT_APP_API_URL}/users/${userId}/following`,
      name: 'Following',
    },
    {
      url: `${REACT_APP_API_URL}/users/${userId}/followers`,
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
