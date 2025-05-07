/*
Purpose of this file: This is the root component of the application.
It assembles other main components (like the Chat component) and can provide the application layout.
Relationship with other files: src/index.tsx renders this App component into the DOM. It will render src/components/Chat/Chat.tsx.
*/
import React from 'react';
import Chat from './components/Chat/Chat'; // Importing the Chat component

function App() {
  return (
    <div className="App">
      <Chat /> {/* Rendering the Chat component */}
    </div>
  );
}

export default App;