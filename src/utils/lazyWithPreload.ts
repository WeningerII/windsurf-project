import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type ModuleLoader<T extends ComponentType<any>> = () => Promise<{ default: T }>;

export type PreloadableLazyComponent<T extends ComponentType<any>> = LazyExoticComponent<T> & {
  preload: () => Promise<{ default: T }>;
};

export function lazyWithPreload<T extends ComponentType<any>>(
  loader: ModuleLoader<T>
): PreloadableLazyComponent<T> {
  let loadedModule: Promise<{ default: T }> | undefined;

  const load = () => {
    if (!loadedModule) {
      loadedModule = loader();
    }
    return loadedModule;
  };

  const Component = lazy(load) as PreloadableLazyComponent<T>;
  Component.preload = load;
  return Component;
}
