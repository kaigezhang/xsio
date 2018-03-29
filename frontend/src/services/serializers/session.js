import { Serializer } from 'jsonapi-serializer';

const SessionSerializer = new Serializer('users', {
  attributes: [
    'email',
    'password'
  ]
});

export default SessionSerializer;
