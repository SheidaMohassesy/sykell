import { useEffect, useState } from "react";

const useIsMobile = (maxWidth: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= maxWidth);
    };

    checkIsMobile(); // Check on mount
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [maxWidth]);

  return isMobile;
};

export default useIsMobile;
