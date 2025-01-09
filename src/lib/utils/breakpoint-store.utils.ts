import { readable, type StartStopNotifier } from "svelte/store";

function createBreakpointStore(breakpoint: number) {
  // This function is called when the first subscriber subscribes.
  const startStopNotifier: StartStopNotifier<boolean> = (set) => {
    if (typeof window === "undefined") return;

    const checkBreakpoint = () => {
      set(window.innerWidth <= breakpoint);
    };

    // Set initial value
    checkBreakpoint();

    // Add event listener
    window.addEventListener("resize", checkBreakpoint);

    // Cleanup function - Svelte will run this when last subscriber unsubscribes
    return () => {
      window.removeEventListener("resize", checkBreakpoint);
    };
  };

  return readable(false, startStopNotifier);
}
