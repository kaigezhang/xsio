import { Serializer } from 'jsonapi-serializer';

const DocumentSerializer = new Serializer('documents', {
  attributes: [
    'title',
    'text',
    'emoji',
    'publish',
    'parent',
  ],
  parent : {
    ref : (_object, id) => id,
    included : false
  },
});

export default DocumentSerializer;
