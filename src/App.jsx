// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Navigation />
            </div>
        </Router>
    );
};

export default App;
