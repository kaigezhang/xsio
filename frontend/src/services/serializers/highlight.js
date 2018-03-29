import { Serializer } from 'jsonapi-serializer';

const HighlightSerializer = new Serializer('annotations', {
  attributes: [
    'selectors',
    'comment',
    // 'file'
  ],
  // file: {
  //   ref: (_object, id) => id,
  //   included: false,
  // },
});

export default HighlightSerializer;
