import React from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import message from '../../assets/icons/message.png';
import waves from '../../assets/icons/waves.png';
import justice from '../../assets/icons/justice.png';

function About() {
  return (
    <div style={{ backgroundColor: '#EFF', padding: '100px 0', height: '89vh' }}>
      <Card style={{ margin: '0 15%' }}>
        <Card.Body>
          <Card.Title>
            <h1>O Projeto</h1>
          </Card.Title>
          <div style={{ padding: '0 25px' }}>
            <p>
              Este chatbot é resultado de um trabalho com o objetivo de explorar o uso de chatbots
              no contexto jurídico, uma área em que a automação e a interação com o usuário são de
              grande importância. Os chatbots, sistemas de conversação baseados em inteligência
              artificial, têm se mostrado eficazes em diversas aplicações, proporcionando interações
              mais naturais e eficientes. A presente aplicação visa atender às necessidades
              específicas do setor jurídico, seja do usuário comum tanto do advogado.
            </p>

            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', margin: '25px' }}>
              <img style={{ width: '80px', height: '80px' }} src={message} alt='*'></img>
              <img
                style={{ width: '80px', height: '80px', transform: 'rotate(90deg)' }}
                src={waves}
                alt='*'
              ></img>
              <img style={{ width: '80px', height: '80px' }} src={justice} alt='*'></img>
            </div>

            <p>
              Essa aplicação e qualquer informação ou conselho apresentado não substitui consultoria
              com um profissional do direito.
            </p>

            <p>Para mais informações sobre a elaboração desse projeto, veja nos links abaixo:</p>

            <div
              style={{ display: 'flex', gap: '200px', justifyContent: 'center', margin: '25px' }}
            >
              <Button as='a' href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7'>
                Artigo
              </Button>
              <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao'>
                Repositório
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default About;
