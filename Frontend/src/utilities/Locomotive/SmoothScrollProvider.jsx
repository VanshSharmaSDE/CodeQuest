import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollProvider = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1, // Adjust smoothness of the scrolling
    });

    // Sync Lenis with ScrollTrigger
    const raf = (time) => {
      lenis.raf(time);    // Update Lenis scroll
      ScrollTrigger.update(); // Ensure ScrollTrigger is updated
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // ScrollTrigger scrollerProxy to sync Lenis
    ScrollTrigger.scrollerProxy(containerRef.current, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
      },
    });

    // Refresh ScrollTrigger after Lenis initialization
    ScrollTrigger.addEventListener('refresh', ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener('refresh', ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="main-content">
      {children}
    </div>
  );
};

export default SmoothScrollProvider;