import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import message from '../../assets/icons/message.png';
import waves from '../../assets/icons/waves.png';
import justice from '../../assets/icons/justice.png';
import styles from './About.module.css';

function About() {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Body>
          <Card.Title>
            <h1 className={styles.title}>O Projeto</h1>
          </Card.Title>
          <div>
            <p>
              Este chatbot é resultado de um trabalho com o objetivo de explorar o uso de chatbots
              no contexto jurídico, uma área em que a automação e a interação com o usuário são de
              grande importância. Os chatbots, sistemas de conversação baseados em inteligência
              artificial, têm se mostrado eficazes em diversas aplicações, proporcionando interações
              mais naturais e eficientes. A presente aplicação visa atender às necessidades
              específicas do setor jurídico, seja do usuário comum tanto do advogado.
            </p>

            <div className={styles.icons}>
              <img className={styles.icon} src={message} alt='*'></img>
              <img className={`${styles.icon} ${styles.rotate}`} src={waves} alt='*'></img>
              <img className={styles.icon} src={justice} alt='*'></img>
            </div>

            <p className={`${styles['center-text']} ${styles['bold-text']}`}>
              Essa aplicação e qualquer informação ou conselho apresentado não substitui consultoria
              com um profissional do direito.
            </p>

            <p>Para mais informações sobre a elaboração desse projeto, veja nos links abaixo:</p>

            <div className={styles.links}>
              <Button as='a' href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7' target='_blank'>
                Artigo
              </Button>
              <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao' target='_blank'>
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
