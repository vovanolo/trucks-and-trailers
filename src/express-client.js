import client from './express-client-src/index';

const app = client('http://localhost:4000/api');

export default app;