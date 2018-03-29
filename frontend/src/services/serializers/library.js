import { Serializer } from 'jsonapi-serializer';

const LibrarySerializer = new Serializer('libraries', {
  attributes: [
    'name',
    'color',
    'description'
  ]
});

export default LibrarySerializer;
