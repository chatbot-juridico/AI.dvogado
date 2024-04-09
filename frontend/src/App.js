import React from 'react';
// import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';

import './App.css';
import Chat from './pages/Chat/Chat';

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/api/users');
  //       setResponseData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div>
      <Header></Header>
      <Chat></Chat>
    </div>
  );
}

export default App;
