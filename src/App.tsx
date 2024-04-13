import { BrowserRouter } from 'react-router-dom';
import { useAppSelector } from './app/store';
import LoadingOverlay from 'react-loading-overlay-ts';
import Router from '@/app/router/Router';

const App = () => {
  const { isActive } = useAppSelector((state) => state.loader);
  return (
    <LoadingOverlay active={isActive} spinner text="Loading...">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </LoadingOverlay>
  );
};

export default App;
