import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type ModuleLoader<TProps extends object> = () => Promise<{ default: ComponentType<TProps> }>;

export type PreloadableLazyComponent<TProps extends object> = LazyExoticComponent<
  ComponentType<TProps>
> & {
  preload: () => Promise<{ default: ComponentType<TProps> }>;
};

export function lazyWithPreload<TProps extends object>(
  loader: ModuleLoader<TProps>
): PreloadableLazyComponent<TProps> {
  let loadedModule: Promise<{ default: ComponentType<TProps> }> | undefined;

  const load = () => {
    if (!loadedModule) {
      loadedModule = loader().catch((error) => {
        loadedModule = undefined;
        throw error;
      });
    }
    return loadedModule;
  };

  const Component = lazy(load) as PreloadableLazyComponent<TProps>;
  Component.preload = load;
  return Component;
}
