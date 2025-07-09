/*
	Modified from https://reactbits.dev/tailwind/
	Removed premium SplitText plugin dependency
*/

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const scrollTriggerRef = useRef(null);

  // Manual text splitting function
  const splitTextManually = (element, type) => {
    const textContent = element.textContent;
    let splitElements = [];
    
    if (type === "chars") {
      element.innerHTML = textContent
        .split('')
        .map((char, i) => 
          `<span class="split-char" style="display: inline-block; white-space: pre;">${char}</span>`
        )
        .join('');
      splitElements = element.querySelectorAll('.split-char');
    } else if (type === "words") {
      element.innerHTML = textContent
        .split(' ')
        .map((word, i) => 
          `<span class="split-word" style="display: inline-block; white-space: pre;">${word}</span>`
        )
        .join(' ');
      splitElements = element.querySelectorAll('.split-word');
    }
    
    return Array.from(splitElements);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;

    const el = ref.current;
    
    animationCompletedRef.current = false;

    // Use manual splitting instead of GSAP SplitText
    const targets = splitTextManually(el, splitType);

    if (!targets || targets.length === 0) {
      console.warn("No targets found for SplitText animation");
      return;
    }

    targets.forEach((t) => {
      t.style.willChange = "transform, opacity";
    });

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? (marginMatch[2] || "px") : "px";
    const sign = marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
        onToggle: (self) => {
          scrollTriggerRef.current = self;
        },
      },
      smoothChildTiming: true,
      onComplete: () => {
        animationCompletedRef.current = true;
        gsap.set(targets, {
          ...to,
          clearProps: "willChange",
          immediateRender: true,
        });
        onLetterAnimationComplete?.();
      },
    });

    tl.set(targets, { ...from, immediateRender: false, force3D: true });
    tl.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
    });

    return () => {
      tl.kill();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      gsap.killTweensOf(targets);
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <div
      ref={ref}
      className={`split-parent overflow-hidden inline-block ${className}`}
      style={{
        textAlign,
        wordWrap: "break-word",
      }}
    >
      {text}
    </div>
  );
};

export default SplitText;