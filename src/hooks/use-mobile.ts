import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // create the tracker for our specific screen size
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // define the function that runs whenever the screen crosses 1023px
    const onChange = () => {
      // mediaQuery.matches is a simple true/false
      setIsMobile(mediaQuery.matches); 
    };

    // tell the browser to start watching for changes
    mediaQuery.addEventListener("change", onChange);
    
    // check the size immediately when the page first loads
    setIsMobile(mediaQuery.matches);
    
    // clean up the watcher if the component unmounts
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}