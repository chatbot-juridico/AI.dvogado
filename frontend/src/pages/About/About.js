import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from '../Home/Home.module.scss';

function About() {
  return (
    <div className={styles['content']}>
      <div className={styles['horizontal-banner']}>
        <div className={styles['banner-content']}>
          <p className={styles['banner-text']}>
            Este chatbot é resultado de um trabalho de graduação com o objetivo de explorar o uso de chatbots no contexto jurídico-trabalhista, uma área em que a automação e a interação com o usuário são de grande importância. Os chatbots, sistemas de conversação baseados em inteligência artificial, têm se mostrado eficazes em diversas aplicações, proporcionando interações mais naturais e eficientes. A presente aplicação visa atender às necessidades específicas do setor trabalhista, seja do
            usuário comum tanto de profissionais da área.
          </p>

          <p className={styles['banner-text']}>Essa aplicação e qualquer informação ou conselho apresentado não substitui consultoria com um profissional do direito.</p>
        </div>
      </div>

      <div className={styles['horizontal-banner']}>
        <Button as='a' className={styles['use-now-btn']} href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7' target='_blank'>
          Artigo
        </Button>
        <Button as='a' className={styles['use-now-btn']} href='https://github.com/chatbot-juridico/AI.dvogado' target='_blank'>
          Repositório
        </Button>
      </div>
    </div>
  );
}

export default About;
