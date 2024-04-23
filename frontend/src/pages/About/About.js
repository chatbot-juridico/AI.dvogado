import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import message from '../../assets/icons/message.png';
import waves from '../../assets/icons/waves.png';
import justice from '../../assets/icons/justice.png';
import './About.css'; // Importe o arquivo de estilos

function About() {
  return (
    <div className='about-container'>
      <Card className='card-container'>
        <Card.Body>
          <Card.Title className='title'>
            <h1>O Projeto</h1>
          </Card.Title>
          <div className='paragraph'>
            <p>
              Este chatbot é resultado de um trabalho com o objetivo de explorar o uso de chatbots
              no contexto jurídico, uma área em que a automação e a interação com o usuário são de
              grande importância. Os chatbots, sistemas de conversação baseados em inteligência
              artificial, têm se mostrado eficazes em diversas aplicações, proporcionando interações
              mais naturais e eficientes. A presente aplicação visa atender às necessidades
              específicas do setor jurídico, seja do usuário comum tanto do advogado.
            </p>

            <div className='icons-container'>
              <img className='icon' src={message} alt='*'></img>
              <img className='icon rotate-icon' src={waves} alt='*'></img>
              <img className='icon' src={justice} alt='*'></img>
            </div>

            <p className='additional-info'>
              Essa aplicação e qualquer informação ou conselho apresentado não substitui consultoria
              com um profissional do direito.
            </p>

            <p>Para mais informações sobre a elaboração desse projeto, veja nos links abaixo:</p>

            <div className='links-container'>
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
