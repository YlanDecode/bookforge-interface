import React from 'react';
import Home from './pages/Home';
import GenerateEbook from './pages/GenerateEbook';
import {Header} from "./components/Header.tsx";
import {BrowserRouter as Router,Route, Routes} from 'react-router-dom';
import "./index.css";

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<GenerateEbook />} />
            </Routes>
        </Router>
    );
};

export default App;
