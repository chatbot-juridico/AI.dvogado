import React, { useEffect, useState } from 'react';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Chat from './pages/Chat/Chat';

import './App.css';

function App() {
  const [users, setUsers] = useState();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    console.log('Recuperando usuários');
    api
      .get('users/')
      .then((response) => setUsers(response.data.results))
      .catch((err) => {
        console.error('Error:' + err);
      });
  };

  const createUser = (event) => {
    event.preventDefault();
    const newUser = {
      username: username,
      email: email,
    };

    api
      .post('users/', newUser)
      .then(() => {
        getUsers();
      })
      .catch((err) => {
        console.error('Error:' + err);
      });

    console.log('Novo usuário criado:', newUser);

    setUsername('');
    setEmail('');
  };

  return (
    <React.StrictMode>
      <Header></Header>
      <Chat></Chat>
      <h2>Usuários</h2>
      <ul>
        {users?.map((user, index) => (
          <li key={index}>
            <a href={user.url}>{user.username}</a> - {user.email}
          </li>
        ))}
      </ul>

      <h2>Criar Usuário</h2>
      <form onSubmit={createUser}>
        <div>
          <label>
            Nome de Usuário:
            <input
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            E-mail:
            <input
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <button type='submit'>Criar Usuário</button>
        </div>
      </form>
    </React.StrictMode>
  );
}

export default App;
