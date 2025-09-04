    // myClientComponent.js
    "use client";

    import React from 'react';

    function MyClientComponent() {
      const handleClick = () => {
        console.log('Button clicked!');
      };

      return (
        <button onClick={handleClick}>
          Click me
        </button>
      );
    }

    export default MyClientComponent;