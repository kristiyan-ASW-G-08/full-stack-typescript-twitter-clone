import { Cloudinary } from '@cloudinary/url-gen';

console.log(process.env.REACT_APP_CLOUD_NAME);
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUD_NAME,
  },
});

export default cld;
