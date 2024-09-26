// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from "./components/Game";
import Settings from './components/Settings';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Game />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
};

export default App;
