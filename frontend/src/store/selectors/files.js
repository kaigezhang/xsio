import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

export const librariesSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Library }) => Library.orderBy('createdAt').all().toRefArray())
);


export const recentlyFilesSelector = createSelector(
  ormSelector,
  createOrmSelector(({ File }) => File
    .orderBy('createdAt')
    .all()
    .toRefArray().map(file => file.id)
  )
);

// export const recentlyFilesSelector = createSelector(
//   librariesSelector,
//   (libraries) => {
//     console.log(libraries, 'libra');
//     return libraries.map(library => library.files.map(file => file.id));
//   }
// );

export const fileIdSelector = (state, props) => props.file;
export const fileByIdSelector = newCreateOrmSelector(
  fileIdSelector, ({ File }, id) => File.get({ id })
);


export const fileRefSelector = createSelector(
  fileByIdSelector, selectedFile => selectedFile.includeRef
);
