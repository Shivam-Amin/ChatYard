import React, { useContext, useEffect, useRef } from 'react'
import img from '../assets/DefaultImage.png'
import '../CSS/chatMessages.css';
import DOMPurify from 'dompurify';
import { Context } from '../main';

const ChatMessages = ({ activeChat, messages }) => {

  const containerRef = useRef(null);
  const { user } = useContext(Context);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom
  function scrollToBottom() {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }


  if (messages.length <= 0) return (
    <div className='selectedChat img'>
      <img src={img} alt="DefaultImage" />
    </div>
  )

  

  const isSameSender = (sender, i) => {
    const length = activeChat.users.length;
    const users = activeChat.users;
    
    if (i === 0) {
      return false;
    }
    return (messages[i-1].sender._id === messages[i].sender._id)
  }

  const isSameSenderMargin = (sender, i) => {
    if (isSameSender(sender, i)) {
      return '0 0 0 56px'
    }
    return '10px 0 0 0'
  }

  return (
    <div className='chatMessages'>
      <nav ref={containerRef} className="container">
        <div className="messages">
          {messages.map((m, i) => {
            // convert the \n to <br /> for new line display
            // by using this approch,
            // it'll save us from XSS attacks.. 
            const sanitizedMessage = DOMPurify.sanitize(m.message.replace(/\n/g, '<br />'));

            return (
              <div 
                className='msg' 
                key={m._id}
                style={{margin: isSameSenderMargin(m.sender, i)}} >
                
                  {
                  !(isSameSender(m.sender, i))
                  ? <>  
                      <img src={m.sender.pic} alt="" />
                      <div className='combineMsg'>
                        <h2>{m.sender.name}</h2>
                        <p dangerouslySetInnerHTML={{ __html: sanitizedMessage }}/>
                      </div>
                    </>
                  : /* this checked for any html in the var sanitizedMessage
                  & if so then it'll add new line as <br /> will be there.
                  */
                  <p dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
                  }


                  
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default ChatMessages