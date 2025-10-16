import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Landing from './pages/Landing.jsx';
import Interest from './pages/Interest.jsx';
import Mindmap from './pages/Mindmap.jsx';
import Universe from './pages/Universe.jsx';
import Resources from './pages/Resources.jsx';
import Summary from './pages/Summary.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'interests', element: <Interest /> },
      { path: 'mindmap', element: <Mindmap /> },
      { path: 'universe', element: <Universe /> },
      { path: 'resources', element: <Resources /> },
      { path: 'summary', element: <Summary /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
