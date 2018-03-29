import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

export const fileDataSelector = state => state.file.file;

export const fileIdSelector = (state, props) => props.match.params.id;

// export const fileByIdSelector = createSelector(
//   ormSelector,
//   fileIdSelector,
//   createOrmSelector(({ File }, id) => {
//     try {
//       const file = File.get({ id });
//       file.includeRef.annotations = file.annotations.toModelArray().map(annotation => annotation.id);
//       return file.includeRef;
//     } catch (e) {
//       return { id };
//     }
//   })
// );

export const fileByIdSelector = newCreateOrmSelector(
  fileIdSelector, ({ File }, id) => {
    const file = File.get({ id });
    file.includeRef.annotations = file.annotations.toModelArray().map(annotation => annotation.includeRef);
    file.includeRef.annotationIds = file.annotations.toModelArray().map(annotation => annotation.id)
    return file.includeRef;
  }
);

export const highlightsSelector = createSelector(
  ormSelector,
  fileIdSelector,
  createOrmSelector(({ Annotation }, id) => Annotation.all().filter({ file: id }).toModelArray())
);

// export const highlightsSelector = createSelector(
//   ormSelector,
//
// )

export const highlightIdSelector = (state, highlight) => highlight;
// export const highlightSelector = createSelector(
//   ormSelector,
//   highlightIdSelector,
//   createOrmSelector(({ Annotation }, id) => Annotation.get({ id }).includeRef)
// )

export const highlightSelector = newCreateOrmSelector(
  highlightIdSelector, ({ Annotation }, id) => {
    const highlight = Annotation.get({ id });
    highlight.includeFk('author');
    return highlight.includeRef;
  }
);
