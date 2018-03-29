import { ORM } from 'redux-orm';

import {
  Annotation,
  Author,
  Comment,
  File,
  Journal,
  Paper,
  Post,
  Profile,
  Tag,
  User,
  Collection,
  Document,
  Library
} from './models';

const models = [
  Annotation,
  Author,
  Comment,
  File,
  Journal,
  Paper,
  Post,
  Profile,
  Tag,
  User,
  Collection,
  Document,
  Library
];

const orm = new ORM();

orm.register(...models);

export default orm;

export const modelNames = models.map(model => model.modelName);
