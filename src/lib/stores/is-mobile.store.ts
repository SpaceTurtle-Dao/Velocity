import { readable, type StartStopNotifier } from "svelte/store";

// This function is called when the first subscriber subscribes.
const startStopNotifier: StartStopNotifier<boolean> = (set) => {
  // Only run on client side
  if (typeof window === "undefined") return;

  // Function to check mobile state
  const checkMobile = () => {
    set(window.innerWidth <= 768);
  };

  // Set initial value
  checkMobile();

  // Add event listener
  window.addEventListener("resize", checkMobile);

  // Cleanup function - Svelte will run this when last subscriber unsubscribes
  return () => {
    window.removeEventListener("resize", checkMobile);
  };
};

export const isMobile = readable<boolean>(false, startStopNotifier);
