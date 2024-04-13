import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from '@/app/store';
import App from '@/App';
import theme from '@/app/theme';
import ErrorBoundaryFallback from '@/components/ErrorBoundaryFallback';
import '@/main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider
          theme={theme}
          toastOptions={{
            toastSpacing: '40px',
            defaultOptions: {
              duration: 2500,
              isClosable: true,
              position: 'top-right',
              variant: 'subtle',
              containerStyle: {
                margin: '24px 24px 0 0',
              },
            },
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
            <App />
          </ErrorBoundary>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  // </React.StrictMode>,
);
