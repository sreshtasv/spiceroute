import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './feedback.js';
import './style1.css';

// ❌ REMOVE: You don't need to import an HTML file in JS
// import './main1.html';

// ❌ REMOVE: JS files should not be imported like CSS
// import './script1.js';

// ✅ Ensure the target element exists in your HTML
const root = document.getElementById('feedback-popup');

if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Error: Element with ID 'feedback-popup' not found!");
}
