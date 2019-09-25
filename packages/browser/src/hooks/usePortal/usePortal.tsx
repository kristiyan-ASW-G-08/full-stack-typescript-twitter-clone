import { useRef, useEffect, MutableRefObject } from 'react';

export const createRootElement = (id: string): HTMLDivElement => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
};

export const appendRootElement = (rootElement: HTMLDivElement): void => {
  document.body.insertBefore(rootElement, document.body.firstChild);
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
    const { current } = rootElementRef;
    const existingParent = document.querySelector<HTMLDivElement>(`#${id}`);
    const parentElement = existingParent || createRootElement(id);
    if (!existingParent) {
      appendRootElement(parentElement);
    }
    if (current) {
      parentElement.appendChild(current);
    }

    return () => {
      if (current) {
        current.remove();
      }
      if (parentElement.childNodes.length === -1) {
        parentElement.remove();
      }
    };
  }, [id]);

  return getRootElement(rootElementRef);
};

export default usePortal;
