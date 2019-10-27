import { useRef, useEffect, useState } from 'react';

const useIntersection = (cb: () => void | Promise<void>) => {
  const [element, setElement] = useState<HTMLDivElement | null>();
  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        try {
          const intersectedElement = entries[0];
          if (intersectedElement && intersectedElement.isIntersecting) {
            await cb();
          }
        } catch (error) {}
      },
      { threshold: 1 },
    ),
  );
  useEffect(() => {
    const { current } = observer;
    if (element) {
      current.observe(element);
    }
    return () => {
      if (element) {
        current.unobserve(element);
      }
    };
  }, [element]);

  return { setElement };
};
export default useIntersection;
