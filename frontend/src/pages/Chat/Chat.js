import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './Chat.css';

function Chat() {
  return (
    <Container fluid>
      <Row xs={1} md={2} id='content' className='g-2'>
        <Col md={9}>
          <Card>
            <Card.Body className='card-body-padding'>
              <Card>
                <Card.Body id='card-chat'>
                  <Card.Title id='card-chat-title'>Chat</Card.Title>
                  <Card.Text>
                    Olá, caro usuário! Eu sou o W e estou aqui como seu assistente para ajudar você
                    com suas dúvidas e solicitações sobre o que a legislação brasileira indica sobre
                    seus direitos e deveres trabalhistas! Selecione um tema abaixo ou converse
                    comigo usando a caixa de texto abaixo!
                  </Card.Text>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body className='card-body-padding' id='card-about'>
              <Card.Title>Sobre</Card.Title>
              <Card.Text>
                Esse chatbot é o resultado de um trabalho de conclusão de curso realizado por
                graduandos da Faculdade do Gama da Universidade de Brasília, com o tema “Utilização
                de Large Language Models no desenvolvimento de um chatbot para consultoria
                jurídico-trabalhista”.
              </Card.Text>
              <Card.Text>
                Esse chatbot está sujeito a erros e não substitui uma consultoria real com um
                advogado.
              </Card.Text>
              <Card.Title>Links</Card.Title>
              <Card.Text>
                Artigo
              </Card.Text>
              <Card.Text>
                GitHub
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
