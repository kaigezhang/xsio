import escape from 'lodash/escape';
import { Document, Block, Node } from 'slate';
import slugify from 'slugify';


function indexOfType(document, heading) {
  const slugified = escape(slugify(heading.text));

  const headings = document
    .nodes
    .filter((node) => {
      if (!node.text) { return null; }
      return node
        .type
        .match('/^heading/') && slugified === escape(slugify(node.text));
    });

  return headings.indexOf(heading);
}

export default function headingToSlug(document, node) {
  const slugified = escape(slugify(node.text));
  const index = indexOfType(document, node);
  if (index === 0) { return slugified; }
  return `${slugified}-${index}`;
}
