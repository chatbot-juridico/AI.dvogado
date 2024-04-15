import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

import './Login.css';

function Login() {
  const [users, setUsers] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };
    await api
      .post('/api-auth/login/', loginData)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem('authToken', token);
        navigate('/');
      })
      .catch((error) => {
        console.error('Ocorreu um erro: ', error);
        setError('Usuário ou senha incorretos.');
      });
  };

  const getUsers = () => {
    api
      .get('api/users/')
      .then((response) => setUsers(response.data.results))
      .catch((err) => {
        console.error('Error:' + err);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário:</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Usuários Cadastrados</h2>
      {users?.map(function (d, idx) {
        return (
          <li key={idx}>
            {d.username} - {d.password}
          </li>
        );
      })}
    </div>
  );
}

export default Login;
