export function isModKey(event) {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  return isMac
    ? event.metaKey
    : event.ctrlKey;
}
