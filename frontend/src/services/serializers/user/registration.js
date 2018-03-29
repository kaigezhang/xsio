import { Serializer } from 'jsonapi-serializer';

const UserRegistrationSerializer = new Serializer('users', {
  attributes: [
    // 'role',
    // 'email',
    // 'firstName',
    // 'lastName',
    'username',
    // 'referal',
    // 'comment',
    'email',
    'password',
  ]
});

export default UserRegistrationSerializer;
