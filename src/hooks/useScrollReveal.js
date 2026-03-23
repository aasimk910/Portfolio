/**
 * useScrollReveal — attaches an IntersectionObserver to a ref.
 * When the element enters the viewport (threshold 0.15), it adds the
 * "visible" class which triggers the CSS fade-up transition.
 *
 * @param {Object} options  IntersectionObserver options override
 * @returns {React.RefObject}
 */
import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el); // fire once
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}
