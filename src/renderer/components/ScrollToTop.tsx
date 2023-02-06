import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, [location]);

  return null;
};

export default ScrollToTop;
