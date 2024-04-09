import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/test/');
        setResponseData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Resposta do Backend:</h2>
      {responseData ? <pre>{JSON.stringify(responseData, null, 2)}</pre> : <p>Carregando...</p>}
    </div>
  );
}

export default App;
