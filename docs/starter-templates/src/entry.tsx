import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// Props your app will receive from hadoku_site
export interface MyAppProps {
  basename?: string;           // e.g., "/myapp"
  apiUrl?: string;             // Your custom config
  environment?: string;        // "development" | "production"
  [key: string]: any;          // Any other props
}

type MountedInstance = {
  root: Root;
};

/**
 * mount() is called when your app is loaded
 * @param el - The DOM element to render into
 * @param props - Configuration from hadoku_site registry
 * @returns The router instance (optional)
 */
export function mount(el: HTMLElement, props: MyAppProps = {}) {
  const { 
    basename = '/myapp',
    apiUrl = 'http://localhost:3000',
    environment = 'development',
    ...restProps 
  } = props;
  
  // Clean up any existing instance
  const existing = (el as any).__myapp as MountedInstance | undefined;
  existing?.root.unmount();
  
  // Create router with basename for proper routing
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App apiUrl={apiUrl} environment={environment} {...restProps} />,
    },
    // Add more routes here...
  ], { basename });
  
  // Render the app
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
  
  // Store instance for cleanup
  const instance: MountedInstance = { root };
  (el as any).__myapp = instance;
  
  console.log('[myapp] Mounted successfully', props);
  
  return router;
}

/**
 * unmount() is called when navigating away or before remounting
 * @param el - The DOM element to clean up
 */
export function unmount(el: HTMLElement) {
  const instance = (el as any).__myapp as MountedInstance | undefined;
  if (instance) {
    instance.root.unmount();
    delete (el as any).__myapp;
    console.log('[myapp] Unmounted successfully');
  }
}
