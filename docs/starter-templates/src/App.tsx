import React from 'react';

export interface AppProps {
  apiUrl?: string;
  environment?: string;
  [key: string]: any;
}

export default function App(props: AppProps) {
  const { apiUrl, environment } = props;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>My Micro-Frontend App</h1>
      <div style={{ marginTop: '1rem', color: '#666' }}>
        <p><strong>API URL:</strong> {apiUrl}</p>
        <p><strong>Environment:</strong> {environment}</p>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <p>✅ Successfully loaded as a micro-frontend!</p>
        <p>Edit <code>src/App.tsx</code> to start building your app.</p>
      </div>
    </div>
  );
}
