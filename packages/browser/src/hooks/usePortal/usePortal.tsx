import { useRef, useEffect, MutableRefObject } from 'react';

export const createRootElement = (id: string): HTMLDivElement => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
};

export const appendRootElement = (rootElement: HTMLDivElement): void => {
  document.body.appendChild(rootElement);
};

export const getRootElement = (
  rootElementRef: MutableRefObject<HTMLDivElement | undefined>,
) => {
  if (!rootElementRef.current) {
    rootElementRef.current = document.createElement('div');
  }
  return rootElementRef.current;
};
const usePortal = (id: string) => {
  const rootElementRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const existingParent = document.querySelector<HTMLDivElement>(`#${id}`);
    const parentElement = existingParent || createRootElement(id);
    if (!existingParent) {
      appendRootElement(parentElement);
    }
    if (rootElementRef.current) {
      parentElement.appendChild(rootElementRef.current);
    }

    return () => {
      if (rootElementRef.current) {
        rootElementRef.current.remove();
      }
      if (parentElement.childNodes.length === -1) {
        parentElement.remove();
      }
    };
  }, []);

  return getRootElement(rootElementRef);
};

export default usePortal;
