import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

export const documentsSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Document }) => Document.all().toRefArray())
);

/* Document list for only id pass to child */
export const documentIdSelector = (state, props) => props.document;

export const documentRefSelector = newCreateOrmSelector(
  documentIdSelector, ({ Document }, id) => {
    try {
      return Document.get({ id }).includeRef;
    } catch (e) {
      return { id };
    }
  }
);

export const documentSlugSelector = (state, match) => match && match.params.documentSlug;

export const documentBySlugSelector = newCreateOrmSelector(
  documentSlugSelector, ({ Document }, slug) => {
    try {
      return Document.get({ slug }).includeRef;
    } catch (e) {
      return { slug };
    }
  }
);

export const recentlyEditedSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Document }) => Document.all().orderBy('createdAt').toRefArray().map(document => document.id))
);

export const documentsStateSelector = state => state.documents;


export const starredSelector = (state) => {};
export const draftsSelector = (state) => {};
