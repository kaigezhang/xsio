import { Serializer } from 'jsonapi-serializer';

const CollectionSerializer = new Serializer('collections', {
  attributes: [
    'name',
    'color',
    'description'
  ]
});

export default CollectionSerializer;
