import faker from 'faker';
import mongoose from 'mongoose';
import User from '@users/User';
import Tweet from '@tweets/Tweet';
import { getUserByEmail } from '@users/services';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
const tweetTemplates = {
  1: `{{lorem.paragraph}},{{image.imageUrl}}`,
  2: `{{lorem.sentences}}`,
  3: `{{lorem.paragraph}},{{image.imageUrl}}`,
  4: `{{lorem.paragraph}},{{image.imageUrl}}`,
  5: `{{lorem.sentence}}`,
  6: `{{lorem.paragraph}},{{image.imageUrl}}`,
  7: `{{lorem.paragraph}}`,
  8: `{{lorem.paragraph}},{{image.imageUrl}}`,
  9: `{{lorem.word}},{{image.imageUrl}}`,
};

const populateDB = async (): Promise<void> => {
  const usersNum = 30;
  const users = new Array(usersNum)
    .fill(null)
    .map(e => {
      return faker
        .fake(
          `{{internet.userName}},{{internet.userName}},{{internet.exampleEmail}},
        {{internet.password}},{{image.avatar}},{{image.imageUrl}} `,
        )
        .split(',');
    })
    .map(([username, handle, email, password, avatar, cover]) => {
      return { username, handle, email, password, avatar, cover };
    });
  const userDocuments = await User.insertMany(users);
  for await (const user of userDocuments) {
    const ids = userDocuments
      .filter(
        userDocument => userDocument._id.toString() !== user._id.toString(),
      )
      .map(({ _id }) => _id);
    user.following = [...ids];
    user.followers = usersNum - 1;
    await user.save();

    const tweets = new Array(10)
      .fill(null)
      .map((e, index) => {
        const num = getRandomInt(1, 9);
        // @ts-ignore
        return faker.fake(tweetTemplates[num]).split(',');
      })
      .map(([text, image]) => {
        if (image) {
          return { text, image, type: 'text', user: user._id };
        }
        return { text, type: 'text', user: user._id };
      });

    await Tweet.insertMany(tweets);
  }

  console.log(userDocuments);
};

export default populateDB;
