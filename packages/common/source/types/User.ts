export default interface User {
  username: string;
  handle: string;
  email: string;
  website: string | undefined;
  profilePhoto: string;
  headerPhoto: string;
  date: string;
  followers: number;
}
