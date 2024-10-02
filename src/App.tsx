// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from "./components/Game";
import Settings from './components/Settings';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.expand();
        } else {
            console.log("Telegram WebApp aniqlanmadi");
        }
    }, []);

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
