import feathers from '@feathersjs/client';
import io from 'socket.io-client';

const socket = io('http://localhost:3030', {
  transports: ['websocket']
});

const app = feathers();

app.configure(feathers.socketio(socket));

app.configure(feathers.authentication({
  storage: window.localStorage
}));

export default app;