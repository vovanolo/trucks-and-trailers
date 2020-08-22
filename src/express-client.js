import client from './express-client-src/index';

const app = client('http://localhost:5050/api');

export default app;