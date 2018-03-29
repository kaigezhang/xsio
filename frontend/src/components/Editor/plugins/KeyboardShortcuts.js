import { Change } from 'slate';
import { isModKey } from '../utils';

export default function KeyboardShortcuts() {
  return {
    onKeyDown(e, change) {
      if (!isModKey(e)) return null;

      switch (e.key) {
      case 'b':
        return this.toggleMark(change, 'bold');
      case 'i':
        return this.toggleMark(change, 'italic');
      case 'u':
        return this.toggleMark(change, 'underlined');
      case 'd':
        return this.toggleMark(change, 'deleted');
      case 'k':
        return change.wrapInline({ type: 'link', data: { href: '' } });
      default:
        return null;
      }
    },
    toggleMark(change, type) {
      const { value } = change;
      // don't allow formatting of document title
      const firstNode = value.document.node.first();
      if (firstNode === value.startBlock) return;
      change.toggleMark(type);
    }
  };
}
