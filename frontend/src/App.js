import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import About from './pages/About/About';
import SignIn from './pages/SignIn/SignIn';
import Profile from './pages/Profile/Profile';

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
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '14px', marginBottom: '5px' }}>Versão 1.0 - Licença MIT</p>
      </div>
    </React.StrictMode>
  );
}

export default App;
