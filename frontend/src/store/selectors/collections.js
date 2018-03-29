import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

const collectionIdSelector = (state, match) => match.params.id;

export const collectionByIdSelector = newCreateOrmSelector(
  collectionIdSelector, ({ Collection }, id) => {
    try {
      const collection = Collection.get({ id });
      collection.includeRef.documents = collection.documents ? collection.documents.toModelArray().map(document => document.includeRef) : [];
      return collection.includeRef;
    } catch (e) {
      return { id };
    }
  }
);

export const recentlyEditDocumentsSelector = createSelector(
  collectionByIdSelector,
  (collection) => {
    if (!collection) {
      return [];
    }
    return (collection.documents || []).map(document => document.id) || [];
  }
);

export const pinnedDocumentsSelector = createSelector(
  collectionByIdSelector,
  (collection) => {
    if (!collection) {
      return [];
    }
    return (collection.documents || []).filter(document => (document.pinned === true ? document.id : null)) || [];
  }
);

// export const collectionByIdSelector = newCreateOrmSelector(
//   collectionIdSelector, ({ Collection }, id) => Collection.get({ id }).includeMany({
//     relations: ['documents'],
//     modifier: document => document.orderBy(d => d.createdAt)
//   })
// );

export const collectionsSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Collection }) => Collection
    .all()
    .orderBy('createdAt')
    .toModelArray()
    .map((collection) => {
      collection.includeRef.documents = collection.documents
        .orderBy('createdAt')
        .toModelArray()
        .map((document) => {
          document.includeMany({
            relations: ['children'],
            modifier: child => child.orderBy(c => c.createdAt)
          });
          return document.includeRef;
        });
      return collection.includeRef;
    })
  )
);


const praramSelector = (state, match) => match.params.id;

