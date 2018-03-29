import { createSelector } from 'reselect';
import { createOrmSelector, ormSelector, newCreateOrmSelector } from './orm';

const libraryIdSelector = (state, match) => match.params.id;

export const librariesSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Library }) => Library.orderBy('createdAt')
    .all()
    .toModelArray()
    .map((library) => {
      library.includeRef.files = library.files
        .orderBy('createdAt')
        .toModelArray()
        .map(file => file.includeRef);
      return library.includeRef;
    })
  )
);

export const libraryByIdSelector = newCreateOrmSelector(
  libraryIdSelector, ({ Library }, id) => {
    console.log('change id');
    try {
      const library = Library.get({ id });
      library.includeRef.files = library.files ? library.files.toModelArray().map(file => file.includeRef) : [];
      return library.includeRef;
    } catch (e) {
      return { id };
    }
  }
);

// export const recentlyFilesSelector = createSelector(
//   libraryByIdSelector,
//   (library) => {
//     console.log('change library')
//     if (!library) {
//       return [];
//     }
//     return (library.files || []).map(file => file.id);
//   }
// );

export const recentlyFilesSelector = newCreateOrmSelector(
  libraryIdSelector, ({ File }, id) => {
    const files = File.all().toModelArray();
    return files.filter(file => (file.libraries.some(library => library === id))).map(file => file.id);
  }
);

export const pinnedFilesSelector = createSelector(
  libraryByIdSelector,
  (library) => {
    console.log('change library');
    if (!library) {
      return [];
    }
    return (library.files || []).filter(file => (file.pinned === true ? file.id : null));
  }
);
