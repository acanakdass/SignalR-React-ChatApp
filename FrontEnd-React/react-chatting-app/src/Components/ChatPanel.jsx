import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { Button, Header } from 'semantic-ui-react';
const ChatPanel = (props) => {

   const [textMessage, setTextMessage] = useState('');
   const [messages, setMessages] = useState([]);

   useEffect(() => {
      if (props.lastReceivedMessage) {
         setMessages(oldMessages => [...oldMessages, props.lastReceivedMessage]);
      }
   }, [props.lastReceivedMessage])

   useEffect(() => {
      if (messages.length > 5) {
         var newMessages = messages;
         newMessages.shift();
         setMessages(newMessages);
      }
   }, [messages])


   const setPlaceHolder = () => {
      if (props.targetUser?.username != undefined) {
         return `Send message to user: ${props.targetUser?.username}`
      } else if (props.targetUser?.groupName) {
         return `Send message to group ${props.targetUser?.groupName}`
      } else {
         return 'Write to everyone'
      }
   }
   return <div>
      <div className="chat-panel">

         <div style={{ minHeight: '20em', maxHeight: '50em' }}>
            {
               messages?.map(message => {
                  if (message.sender == props.currentUser?.username) {
                     return (
                        <div className="row no-gutters">
                           <div className="col-md-3 offset-md-8">
                              <div className="chat-bubble chat-bubble--right">
                                 <Header size='tiny'>{props.currentUser?.username}</Header>
                                 {message?.message}
                              </div>
                           </div>
                        </div>
                     )
                  } else {
                     return (
                        <div className="row no-gutters">
                           <div className="col-md-3">
                              <div className="chat-bubble chat-bubble--left">
                                 <Header size='tiny'>{message?.sender}</Header>
                                 {message?.message}
                              </div>
                           </div>
                        </div>
                     )
                  }
               })


            }
         </div>

         <div className="row">
            <div className="col-12">
               <div className="chat-box-tray">
                  <SentimentVerySatisfiedIcon />
                  <input value={textMessage} id='messageInput' type="text" onChange={(e) => setTextMessage(e.target.value)} placeholder={setPlaceHolder()} />
                  <MicIcon />
                  <Button onClick={() => {
                     if (props.targetUser?.username) {
                        props.sendMessage(textMessage, props.targetUser.username)
                     } else if (props.targetUser?.groupName) {
                        props.sendMessageToGroup(textMessage, props.targetUser.groupName)
                     } else {
                        props.sendMessage(textMessage, 'Everyone')
                     }
                     setTextMessage('')
                     // setMessages(oldMessages => [...oldMessages, {
                     //    message: props.lastSentMessage,
                     //    sender: props.currentUser?.username
                     // }]);
                  }}>
                     <SendIcon />
                  </Button>

               </div>
            </div>
         </div>
      </div>
   </div >;
};

export default ChatPanel;
