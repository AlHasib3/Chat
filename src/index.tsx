/*
Purpose of this file: This is the main entry point for the React application.
It renders the App component into a specific DOM element (usually a div named 'root').
Relationship with other files: It is directly linked with the <div id="root"></div> in public/index.html and with src/App.tsx (the main app component).
Required packages: react, react-dom.
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importing the main application component

// The root DOM element where the application will be mounted
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure an element with id 'root' exists in your HTML.");
}