import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import About from './pages/About/About';
import SignIn from './pages/SignIn/SignIn';
import Profile from './pages/Profile/Profile';
import Feedback from './pages/Feedback/Feedback';
import Home from './pages/Home/Home';

import PrivateRoutes from './components/PrivateRoutes';
import background from './assets/images/not-found-background.jpg';

import './App.scss';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='*' element={<NotFound />} />

          <Route element={<PrivateRoutes />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </Router>
      <div style={{ position: 'relative', marginTop: '5rem', paddingBottom: '2%' }}>
        <p style={{ textAlign: 'center', margin: '0', color: 'white' }}>Desenvolvido por Álvaro Gouvea e Luís Lins</p>
        <p style={{ textAlign: 'center', margin: '0', color: 'white' }}>Universidade de Brasília - Faculdade do Gama</p>
        <p style={{ textAlign: 'center', margin: '0', color: 'white' }}>Brasília - 2024</p>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '91.7vh',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          color: '#FFF',
          fontWeight: 'bold',
          position: 'absolute',
          top: '20vh',
          left: '25vw',
        }}
      >
        Você não deveria estar aqui... Por que você está aqui?
      </h1>
      <h1
        style={{
          color: '#FFF',
          fontWeight: 'bold',
          position: 'absolute',
          top: '42vh',
          left: '60vw',
          fontSize: '115px',
        }}
      >
        Sai
      </h1>
      <p
        style={{
          color: '#FFF',
          fontWeight: 'bold',
          position: 'absolute',
          bottom: 0,
          right: '25px',
          fontSize: '18px',
        }}
      >
        Por favor...?
      </p>
    </div>
  );
}

export default App;
