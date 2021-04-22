/* eslint-disable */
import { useLayoutEffect, useCallback, useEffect } from 'react';

const useDebouncedLayoutEffect = (effect: any, delay: any, deps: any) => {
  const callback = useCallback(effect, deps);

  useLayoutEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};

const useDebouncedEffect = (effect: any, delay: any, deps: any) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};

export {
  useDebouncedLayoutEffect,
  useDebouncedEffect
};
