import React, { useState, useEffect } from 'react'
import { Button, Divider, Header, Image, Input, List } from 'semantic-ui-react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import toast from 'react-hot-toast';
import './chattingTemplate.css'

import CachedIcon from '@mui/icons-material/Cached';
import MessageIcon from '@mui/icons-material/Message';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChatPanel from './ChatPanel';
import ClientsSidebar from './ClientsSidebar';
const ChattingTemplate = (props) => {

   const [connection, setConnection] = useState(null);
   const [usernameInput, setUsernameInput] = useState('');
   const [groupNameInput, setGroupNameInput] = useState('');
   const [currentUser, setCurrentUser] = useState(null);
   const [clients, setClients] = useState(null);
   const [groups, setGroups] = useState(null);
   const [targetUser, setTargetUser] = useState(null);
   const [lastReceivedMessage, SetLastReceivedMessage] = useState(null);
   const [lastSentMessage, setLastSentMessage] = useState(null);

   useEffect(() => {
      const connection = new HubConnectionBuilder()
         .withUrl("https://localhost:5001/chathub")
         .withAutomaticReconnect([0, 1000, 3000, 7000, 10000])
         .build();
      console.log('connectin')
      console.log(connection)
      setConnection(connection);

      console.log('connection.state')
      console.log(connection.state)
      setTimeout(() => {
         console.log('connection state is :', connection.state);
      }, 3000)
   }, []);

   useEffect(() => {
      console.log('trying')
      if (connection) {
         connection.start().then(() => {
            console.log('connected to signalR')
            connectionMethods()
         }).catch(err => {
            console.log(err)
            console.log('error while connecting')
         })


         connection.onclose(async (error) => {
            toast.error('Connection closed:' + error)
            await start();
         });
         connection.onreconnected((connectionId) => {
            console.log('Reconnected to server with connection id : ' + connectionId)
            toast.success('Reconnected to Server')
         })

         connection.onreconnecting((connectionId) => {
            console.log('Trying to reconnect to server')
            toast('Trying to Reconnect to Server')
         })
      }
   }, [connection]);

   async function start() {
      try {
         await connection.start();
         console.log("SignalR Connected.");
      } catch (err) {
         console.log(err);
         setTimeout(start, 5000);
      }
   };

   const setTargetUserFunc = (user) => {
      setTargetUser(user)
      // if (user == null) {
      //    console.log('setted target user:' + user)
      // } else {

      //    setTargetUser(user);
      //    console.log('setted target user:' + user.username)
      // }
   }
   const connectionMethods = () => {
      if (connection.state == 'Connected') {

         connection.on("clientJoined", message => {
            toast(`Client ${message} joined`)
         })

         connection.on("currentUser", message => {
            toast.success(`Welcome ${message.username}`)
            setCurrentUser(message)
         })
         connection.on("receiveMessage", (message, username) => {
            toast.success(`Message Received: ${message} from ${username}`)
            console.log(message)
            SetLastReceivedMessage({ message: message, sender: username })
         })

         connection.on("clients", message => {
            // toast('Client: ' + message)
            console.log('Clients')
            console.log(message)
            setClients(message)
         })

         connection.on("groups", message => {
            console.log(message)
            setGroups(message)
         })

         connection.on("lastSentMessage", message => {
            setLastSentMessage(message)
         })
      }
   }

   const addGroup = async () => {
      if (connection.state == 'Connected') {
         console.log('invoking add group')
         await connection.invoke("AddGroup", groupNameInput).then(() => {
            toast.success('Group Add Message Sent')
         }).catch(err => {
            toast.error(err)
            console.log(err)
         })
      }
   };

   const joinToGroup = async (groupName) => {
      if (connection.state == 'Connected') {
         console.log('invoking join to group')
         await connection.invoke("AddClientToGroup", groupName).then(() => {
            console.log('message sent')
            toast.success('Joined to group')
         }).catch(err => {
            toast.error(err)
            console.log(err)
         })
      }
   };


   const join = async () => {
      if (connection.state == 'Connected') {
         console.log('invoking get username')
         await connection.invoke("GetUsername", usernameInput).then(() => {
            console.log('message sent')
            toast.success('Message Sent')
         }).catch(err => {
            toast.error(err)
            console.log(err)
         })
      }
   };

   const sendMessage = async (message, username) => {
      //if username = 'Everyone' sends message to all clients
      await connection.invoke("SendMessage", message, username).then(res => {
         console.log(res)
         toast.success("Message Sent to " + targetUser?.connectionId)
      })
   }

   const sendMessageToGroup = async (message, groupName) => {
      //if username = 'Everyone' sends message to all clients
      await connection.invoke("SendMessageToGroup", message, groupName).then(res => {
         console.log(res)
         toast.success("Message Sent to group " + groupName)
      })
   }

   // const sendMessage = async (message) => {
   //    await connection.invoke("SendDirectMessage", targetUser.connectionId, message).then(res => {
   //       console.log(res)
   //       toast.success("Message Sent to " + targetUser?.connectionId)
   //    })
   // }


   return (
      <div style={{ margin: '1em', padding: '1em', backgroundColor: 'black', flex: 1 }}>


         <div style={{ backgroundColor: 'white', borderRadius: 25, padding: '3em', margin: '1em' }}>

            <Header size='large' textAlign='center' color='green'>{currentUser?.username}</Header>
            <Header size='small' textAlign='center' color='red'>{currentUser?.connectionId}</Header>

            <Input onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput} placeholder="Enter username" ></Input>
            <br /> <br />
            <Button onClick={() => join()}>Giriş Yap</Button>
            <Divider />
         </div>
         <div style={{ backgroundColor: 'white', borderRadius: 25, padding: '2em', margin: '1em' }}>
            <Header size='huge' textAlign='center' >Groups</Header>
            <br />
            <div style={{ backgroundColor: 'white', borderRadius: 25, display: 'flex', justifyContent: 'center' }}>
               {/* <Header size='small' textAlign='center' color='red'>{currentUser?.connectionId}</Header> */}

               <Input onChange={(e) => setGroupNameInput(e.target.value)} value={groupNameInput} placeholder="Enter group name" ></Input>
               <br /> <br />
               <Button onClick={() => addGroup()}>Add Group</Button>
               <Divider />
            </div>
            <br />
            {groups?.map(group => (
               <List divided verticalAlign='middle'>
                  <List.Item>
                     <List.Content floated='right'>
                        <Button onClick={() => joinToGroup(group.groupName)}>Join</Button>
                     </List.Content>
                     <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                     <List.Content>{group.groupName} </List.Content>
                     <List.List>
                        {group.clients.map(c => (
                           <List.Item>{c.username}</List.Item>
                        ))}
                     </List.List>
                  </List.Item>
               </List>
            ))}
         </div>


         <div style={{ backgroundColor: 'white', borderRadius: 25, padding: '2em' }} className="container">
            <div className="row no-gutters">
               <ClientsSidebar setTargetUserFunc={setTargetUserFunc} currentUser={currentUser} groups={groups} clients={clients} />
               <div className="col-md-8">
                  <div className="settings-tray">
                     <div className="friend-drawer no-gutters friend-drawer--grey">
                        {/* <img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" /> */}

                        <div className="text">
                           <h3>Client of SignalR Project Group</h3>
                        </div>

                        <span className="settings-tray--right">
                           <CachedIcon />
                           <MessageIcon />
                           <MenuIcon />
                        </span>
                     </div>
                  </div>
                  <ChatPanel sendMessageToGroup={sendMessageToGroup} currentUser={currentUser} lastSentMessage={lastSentMessage} targetUser={targetUser} lastReceivedMessage={lastReceivedMessage} sendMessage={sendMessage} />
               </div>
            </div>
         </div>
      </div>

   )
};

export default ChattingTemplate;
