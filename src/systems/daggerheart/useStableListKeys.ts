import { useRef } from 'react';
import { generateUUID } from '../../utils/browserCompat';

/**
 * Stable React keys for a list persisted as bare values (no ids), e.g. the
 * Daggerheart experiences string array. Keys are generated once per entry and
 * removed in lockstep with the entry, so deleting row N while editing row N+1
 * no longer reuses the wrong DOM node / drops the caret into the wrong input.
 * The persisted shape stays a plain value array (backward-compatible).
 */
export function useStableListKeys(length: number) {
  const keysRef = useRef<string[]>([]);
  if (keysRef.current.length > length) {
    keysRef.current = keysRef.current.slice(0, length);
  }
  while (keysRef.current.length < length) {
    keysRef.current.push(generateUUID());
  }

  return {
    keys: keysRef.current,
    removeKeyAt: (index: number) => {
      keysRef.current = keysRef.current.filter((_, keyIndex) => keyIndex !== index);
    },
  };
}
