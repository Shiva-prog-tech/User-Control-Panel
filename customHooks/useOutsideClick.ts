"use client";

import { RefObject, useEffect } from "react";

// Fires the callback when the user clicks outside the referenced element.
const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutsideClick]);
};

export default useOutsideClick;
