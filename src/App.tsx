import React from 'react';
import { HashRouter } from 'react-router';
import { AppRoutes } from './core/router';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App;
