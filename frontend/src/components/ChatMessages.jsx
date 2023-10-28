import React, { useContext, useEffect, useRef } from 'react'
import img from '../assets/DefaultImage.png'
import '../CSS/chatMessages.css';
import DOMPurify from 'dompurify';
import { Context } from '../main';
// import { isSameSender, isSameSenderMargin, isSameSenderPadding } from './Functions/chatMessagesFunctions';

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

  const isSameSender = (sender, i) => {
    const length = activeChat.users.length;
    const users = activeChat.users;
    
    if (i === 0) {
      return false;
    }
    return (messages[i-1].sender._id === messages[i].sender._id)
  }
  
  const isSameSenderPadding = (sender, i, isDateEqual) => {
    if (isSameSender(sender, i) && isDateEqual) {
      if (i === messages.length-1) {
        return '1px 0 20px 70px'
      }
      return '1px 0 1px 70px'
    }
    if (i === messages.length-1) {
      return '1px 0 20px 15px'
    }
    return '1px 0 1px 15px'
  }
  
  const isSameSenderMargin = (sender, i, isDateEqual) => {
    if (isSameSender(sender, i) && isDateEqual) {
      return '0'
    }
    
    return '18px 0 0 0'
  }


  if (messages.length <= 0) return (
    <div className='selectedChat img'>
      <img src={img} alt="DefaultImage" />
    </div>
  )

  return (
    <div className='chatMessages'>
      <nav ref={containerRef} className="container">
        <div className="messages">
          {messages.map((m, i) => {
            // convert the \n to <br /> for new line display
            // by using this approch,
            // it'll save us from XSS attacks.. 
            const sanitizedMessage = DOMPurify.sanitize(m.message.replace(/\n/g, '<br />'));
            
            const createdAtDate = new Date(m.createdAt);
            // Format date and time
            const formattedDate = createdAtDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            const formattedTime = createdAtDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            // COMPARE WITH CURRENT DATE.
            const lastDate = new Date(messages[i-1]?.createdAt);
            const lastFormattedDate = lastDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });
            const tempDate = createdAtDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });
            // Compare the formatted date with the current date
            const isDateEqual = tempDate === lastFormattedDate;

            const time = formattedDate + "  " + formattedTime;

            return (
              <div key={m._id}>
                {(!isDateEqual) 
                ? <div className="date-with-line">
                    <div className="date">{tempDate}</div>
                  </div> 
                : null}
                <div 
                  className='msg' 
                  key={m._id}
                  style={{padding: isSameSenderPadding(m.sender, i, isDateEqual), 
                  margin: isSameSenderMargin(m.sender, i, isDateEqual)}} >
                  
                    {
                    (!(isSameSender(m.sender, i)) || !isDateEqual)
                    ? <>  
                        <img src={m.sender.pic} alt="" />
                        <div className='combineMsg'>
                          <div className="grp">
                            <h2>{m.sender.name}</h2>
                            <p> {time} </p>
                          </div>
                          <p dangerouslySetInnerHTML={{ __html: sanitizedMessage }}/>
                        </div>
                      </>
                    : /* this checked for any html in the var sanitizedMessage
                    & if so then it'll add new line as <br /> will be there.
                    */
                    <>
                      <span> {formattedTime} </span>
                      <p dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
                    </>
                    }
                    
                </div>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default ChatMessages