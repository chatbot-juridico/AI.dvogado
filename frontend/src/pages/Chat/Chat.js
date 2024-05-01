import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios'; // TEMP

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';

import icon from '../../assets/icons/icon.png';
import menu from '../../assets/icons/menu.png';
import arrowUp from '../../assets/icons/arrow-up.png';
import reload from '../../assets/icons/reload.png';
import clipboard from '../../assets/icons/clipboard.png';

import api from '../../services/api';
import styles from './Chat.module.scss';

function Chat() {
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showChats, setShowChats] = useState(false);
  const [currentChat, setCurrentChat] = useState();
  const [input, setInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useRef();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClose = () => setShowChats(false);
  const handleShow = () => setShowChats(true);

  useEffect(() => {
    const getUserId = () => {
      const token = localStorage.getItem('authToken');
      api
        .get(`/api/user-details/?token=${token}`)
        .then((res) => {
          const id = res.data.id;
          setUserId(id);
          getChats(id);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    };

    if (localStorage.getItem('authToken')) {
      getUserId();
    } else {
      getChats(null);
    }
  }, [userId]);

  useEffect(() => {
    if (chats.length > 0) {
      if (currentChat) {
        const chat = chats.find((chat) => chat.id === currentChat.id);
        if (chat) {
          chat.messages = chat.messages.sort((a, b) => a.id - b.id);
          setCurrentChat(chat);
          setTimeout(scrollDown, 100);
        }
      } else {
        const lastChat = chats[chats.length - 1];
        setCurrentChat(lastChat);
      }
    }
  }, [chats, currentChat]);

  const sendMessage = useCallback(
    (message, user) => {
      api
        .post('api/messages/', { chat: currentChat.id, content: message, user: user })
        .then((res) => {
          const updatedChats = chats.map((chat) => {
            if (chat.id === currentChat.id) {
              return {
                ...chat,
                messages: [...chat.messages, res.data],
              };
            }
            return chat;
          });
          setChats(updatedChats);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error:' + err);
        })
        .finally(() => {
          setInput('');
        });
    },
    [chats, currentChat, setChats, setIsLoading, setInput]
  );

  useEffect(() => {
    const getBotAnswer = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        url: 'https://famous-quotes4.p.rapidapi.com/random',
        params: {
          category: 'all',
          count: '1',
        },
        headers: {
          'X-RapidAPI-Key': '48969325c7msh182124cce3b96dap1c5a70jsn7bca8705e06e',
          'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
        },
      };
      try {
        const response = await axios.request(options);
        const content = response.data[0].text;
        const botId = 1;
        sendMessage(content, botId);
      } catch (error) {
        console.error(error);
      }
    };

    if (currentChat) {
      if (currentChat.messages.length === 0) return;
      const lastMessage = currentChat.messages[currentChat.messages.length - 1];
      if (lastMessage.user !== 1) {
        getBotAnswer();
      }
    }
  }, [currentChat]);

  const getChats = async (userId) => {
    setIsLoading(true);
    const endpoint = userId ? `api/chats-messages/?user_id=${userId}` : `api/chats-messages`;
    return await api
      .get(endpoint)
      .then((res) => {
        setChats(res.data);
        setIsLoading(false);
        return res.data;
      })
      .catch((err) => {
        console.error('Erro: ', err);
      });
  };

  const selectChat = (id) => {
    const chat = chats.find((chat) => chat.id === id);
    setCurrentChat(chat);
    handleClose();
    setTimeout(scrollDown, 100);
  };

  const toggleMenu = (event) => {
    const icon = event.target;
    let currentRotation = parseInt(icon.style.transform.replace('rotate(', '').replace('deg)', ''), 10) || 0;
    currentRotation += 90;
    icon.style.transform = `rotate(${currentRotation}deg)`;
    setIsExpanded(!isExpanded);
  };

  const scrollDown = () => {
    const div = divRef.current;
    div.scrollTop = div.scrollHeight + div.clientHeight;
  };

  const createChat = (user) => {
    const displayNumber = chats.length;
    api
      .post('api/chats/', { title: `Novo Chat ${displayNumber}`, user: user })
      .then(async (res) => {
        const allChats = await getChats(userId);
        let newChat = allChats.find((chat) => chat.id === res.data.id);
        newChat.messages = newChat.messages.sort((a, b) => a.id - b.id);
        setCurrentChat(newChat);
      })
      .catch((err) => {
        console.error('Erro: ', err);
      });
  };

  const deleteChats = (chatId) => {
    const deleteAll = !chatId;

    for (let index = 0; index < chats.length; index++) {
      const chat = chats[index];
      if (deleteAll || chat.id === chatId) {
        api
          .delete(`api/chats/${chat.id}`)
          .then(async () => {
            if ((index === chats.length - 1 && deleteAll) || (!deleteAll && chats.length === 1)) {
              createChat(userId);
              handleClose();
            }
            const allChats = await getChats(userId);
            if (currentChat.id === chatId) {
              const newCurrentChat = allChats[allChats.length - 1];
              setCurrentChat(newCurrentChat);
            }
          })
          .catch((err) => {
            console.error('Error:' + err);
          });
      }
    }
  };

  const reloadAnswer = (message) => {
    api
      .delete(`api/messages/${message.id}`)
      .then(async () => {
        const allChats = await getChats(userId);
        const updatedChat = allChats.find((chat) => chat.id === currentChat.id);
        setCurrentChat(updatedChat);
      })
      .catch((err) => {
        console.error('Error:' + err);
      });
  };

  const copyToClipboard = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <Row className={styles['container']}>
      {/* CHAT */}
      <Col lg={isExpanded ? 10 : 11} md={12} className={styles['chat-column']}>
        {/* CHATS OVERLAY */}
        <Offcanvas show={showChats} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Suas Conversas</Offcanvas.Title>
          </Offcanvas.Header>
          <Button style={{ width: 'fit-content', marginLeft: '12px' }} onClick={() => createChat(userId)}>
            + Nova Conversa
          </Button>
          <hr />
          <Offcanvas.Body>
            <ListGroup>
              {chats?.map(function (chat, idx) {
                return (
                  <ListGroup.Item
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button variant='Link' onClick={() => selectChat(chat.id)}>
                      {chat.title}
                    </Button>
                    <CloseButton onClick={() => deleteChats(chat.id)} />
                  </ListGroup.Item>
                );
              })}
            </ListGroup>

            <div
              style={{
                position: 'relative',
                bottom: '0px',
                width: '100%',
                textAlign: 'center',
                marginTop: '10px',
                padding: '10px 0px',
              }}
            >
              <Button variant='danger' onClick={() => deleteChats()}>
                Excluir todas as conversas
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* MESSAGES */}
        <Card>
          <Card.Body className={styles['chat-card']}>
            <Card.Title className={styles['chat-title']}>
              <Button variant='link' onClick={handleShow} disabled={!userId}>
                <img
                  style={{
                    width: '30px',
                    height: '30px',
                  }}
                  src={menu}
                  alt='='
                />
              </Button>
              <h2 contenteditable='true'>{currentChat?.title ? currentChat?.title : 'Chat'}</h2>
              <div style={{ width: '30px' }}></div>
            </Card.Title>
            <div ref={divRef} className={styles['messages-container']}>
              {currentChat?.messages?.map(function (message, idx) {
                const isBot = message.user === 1;
                const isLastMessage = idx === currentChat?.messages?.length - 1;
                return (
                  <Card.Text
                    key={idx}
                    className={styles['message-box']}
                    style={{
                      margin: isBot ? '10px 10px 10px 175px' : '10px 175px 10px 10px',
                      backgroundColor: isBot ? '#070928' : '#EEEEEE',
                      color: isBot ? '#EEEEEE' : '',
                    }}
                  >
                    <span className={styles['message-content']}>
                      <img className={styles['message-icon']} src={icon} alt='*'></img>
                      <span>{message.content}</span>
                    </span>

                    {isBot && (
                      <span className={styles['message-actions']}>
                        <Button as='a' variant='Link' onClick={() => copyToClipboard(message)}>
                          <img src={clipboard} alt='copy' style={{ height: '16px' }}></img>
                        </Button>
                        {isLastMessage && (
                          <Button as='a' variant='Link' onClick={() => reloadAnswer(message)}>
                            <img src={reload} alt='reload' style={{ height: '16px' }}></img>
                          </Button>
                        )}
                      </span>
                    )}
                  </Card.Text>
                );
              })}
              {isLoading && (
                <div className={styles['loading']}>
                  <Spinner animation='border' />
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* INPUT */}
        <Card className={styles['input-container']}>
          <Card.Body className={styles['input-card']}>
            <Form style={{ width: '92%' }}>
              <Form.Control className={styles['input-textarea']} as='textarea' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Sua mensagem...' required rows={2} />
            </Form>
            <Button variant='primary' onClick={() => sendMessage(input, userId)} disabled={isLoading} className={styles['send-message-button']}>
              <img
                style={{
                  width: '25px',
                  height: '25px',
                }}
                src={arrowUp}
                alt='^'
              ></img>
            </Button>
          </Card.Body>
        </Card>
      </Col>

      {/* SOBRE */}
      {isExpanded && (
        <Col lg={2} md={12} sm={12}>
          <Card>
            <Card.Body className={styles['about-card']}>
              <div className={styles['about-split-content']}>
                <div>
                  <div className={styles['about-title-area']}>
                    <Button variant='link' onClick={toggleMenu}>
                      <img className={styles['about-menu-icon']} src={menu} alt='*'></img>
                    </Button>

                    <Card.Title>
                      <h2>Sobre</h2>
                    </Card.Title>

                    <div style={{ width: '15px' }}></div>
                  </div>

                  <Card.Text>Esse chatbot é o resultado de um trabalho de conclusão de curso realizado por graduandos da Faculdade do Gama da Universidade de Brasília, com o tema “Utilização de Large Language Models no desenvolvimento de um chatbot para consultoria jurídico-trabalhista”.</Card.Text>
                  <Card.Text className={styles['about-warning']}>Esse chatbot está sujeito a erros e não substitui uma consultoria real com um advogado.</Card.Text>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Card.Title style={{ textAlign: 'center' }}>
                    <h3>Links</h3>
                  </Card.Title>
                  <div className={styles['buttons-area']}>
                    <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao' target='_blank' style={{ minWidth: '90%' }}>
                      Repositório
                    </Button>
                    <Button as='a' href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7' target='_blank' style={{ minWidth: '90%' }}>
                      Artigo
                    </Button>
                  </div>
                </div>
              </div>
              {/* Split content */}
            </Card.Body>
          </Card>
        </Col>
      )}

      {!isExpanded && (
        <Col lg={1} md={12}>
          <Card>
            <Card.Body className={styles['about-card']}>
              <div className={styles['about-split-content']} style={{ alignItems: 'center' }}>
                <div className={styles['about-title-area']}>
                  <Button variant='link' onClick={toggleMenu}>
                    <img className={styles['about-menu-icon']} src={menu} alt='='></img>
                  </Button>
                </div>

                <div className={styles['buttons-area']}>
                  <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao' target='_blank' style={{ minWidth: '80%' }}>
                    Repo
                  </Button>
                  <Button as='a' href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7' target='_blank' style={{ minWidth: '80%' }}>
                    Art.
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
}

export default Chat;
