import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import About from './pages/About/About';

import './App.css';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Chat />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
