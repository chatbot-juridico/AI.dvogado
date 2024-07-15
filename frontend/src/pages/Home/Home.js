import React from 'react';
import Button from 'react-bootstrap/Button';
import homeIA from '../../assets/images/home-ia.jpg';
import home2 from '../../assets/images/home-2.jpg';
import home3 from '../../assets/images/home-3.jpg';
import styles from './Home.module.scss';

function Home() {
  return (
    <div className={styles['content']}>
      <div className={[styles['horizontal-banner']]}>
        <div className={styles['banner-content']}>
          <p className={styles['banner-text']}>Transforme a forma como você lida com questões trabalhistas com nossa inovadora ferramenta de assistência jurídica: o Chatbot AI.dvogado. Projetado para simplificar e agilizar suas necessidades legais, nosso chatbot combina a precisão do conhecimento jurídico com a conveniência da tecnologia de inteligência artificial. </p>
        </div>
      </div>

      <div className={styles['horizontal-banner']}>
        <div className={styles['banner-content']}>
          <p className={styles['banner-title']}>O que é?</p>
          <p className={styles['banner-text']}>Nosso chatbot é uma plataforma interativa que oferece respostas rápidas e precisas para uma ampla gama de questões relacionadas ao direito trabalhista. Desde dúvidas sobre legislação até orientações práticas sobre procedimentos legais, o chatbot está aqui para ajudar empresas e trabalhadores a navegar pelo complexo ambiente jurídico trabalhista de forma eficiente.</p>

          <Button as='a' className={styles['use-now-btn']} href='/chat'>
            Usar agora!
          </Button>
        </div>

        <img src={homeIA} alt='IA' className={styles['banner-image']} />
      </div>

      <div className={styles['horizontal-banner']}>
        <img src={home2} alt='business man' className={styles['banner-image']} />

        <div className={styles['banner-content']}>
          <p className={styles['banner-title']}>Funcionalides Principais</p>
          <p className={styles['banner-text']}>
            <strong>Consulta Jurídica Instantânea: </strong>Receba respostas imediatas para suas perguntas jurídicas, 24 horas por dia, 7 dias por semana.
          </p>
          <p className={styles['banner-text']}>
            <strong>Guias Passo a Passo: </strong> Orientações detalhadas sobre processos legais como demissões, acordos trabalhistas e direitos do trabalhador.
          </p>
          <p className={styles['banner-text']}>
            <strong>Atualizações Legislativas: </strong>Mantenha-se informado sobre mudanças na legislação trabalhista que podem impactar sua empresa ou seus direitos como empregado.
          </p>
          <p className={styles['banner-text']}>
            <strong>Múltiplas Respostas: </strong>Por acaso a resposta não foi como você gostaria? Você pode reenviar a sua última mensagem para múltiplos modelos e escolher a que melhor enquadra no seu contexto.
          </p>
        </div>
      </div>

      <div className={styles['horizontal-banner']}>
        <div className={styles['banner-content']}>
          <p className={styles['banner-title']}>Importância Contextual</p>
          <p className={styles['banner-text']}>Em um ambiente empresarial cada vez mais regulamentado, é crucial contar com informações legais precisas e acessíveis. Nosso chatbot não apenas economiza tempo e recursos, mas também oferece tranquilidade ao garantir conformidade com as leis trabalhistas vigentes. Seja você um empregador buscando orientação legal ou um funcionário com dúvidas sobre seus direitos, o AI.dvogado está aqui para ajudar.</p>
        </div>

        <img src={home3} alt='Importance' className={styles['banner-image']} />
      </div>
    </div>
  );
}

export default Home;
