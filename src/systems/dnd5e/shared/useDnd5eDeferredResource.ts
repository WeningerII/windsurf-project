import { useCallback, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { GameSystemId } from '../../../types/game-systems';

interface UseDnd5eDeferredResourceOptions<T> {
  systemId: GameSystemId;
  activeSystemIdRef: MutableRefObject<GameSystemId>;
  loader: (systemId: GameSystemId) => Promise<T[]>;
}

export function useDnd5eDeferredResource<T>({
  systemId,
  activeSystemIdRef,
  loader,
}: UseDnd5eDeferredResourceOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loaded, setLoaded] = useState(false);
  const requestRef = useRef<Promise<void> | null>(null);

  const reset = useCallback(() => {
    setData([]);
    setLoaded(false);
    requestRef.current = null;
  }, []);

  const load = useCallback(async () => {
    if (loaded) {
      return;
    }

    if (requestRef.current) {
      return requestRef.current;
    }

    const requestSystemId = systemId;
    const request = loader(requestSystemId)
      .then((loadedData) => {
        if (activeSystemIdRef.current !== requestSystemId) {
          return;
        }

        setData(loadedData);
        setLoaded(true);
      })
      .finally(() => {
        if (requestRef.current === request) {
          requestRef.current = null;
        }
      });

    requestRef.current = request;
    return request;
  }, [activeSystemIdRef, loaded, loader, systemId]);

  return {
    data,
    loaded,
    load,
    reset,
  };
}
