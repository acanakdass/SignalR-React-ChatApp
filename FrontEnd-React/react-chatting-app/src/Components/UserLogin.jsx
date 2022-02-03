import React, { useState, useEffect } from 'react'
import { Button, Divider, Header, Input, List } from 'semantic-ui-react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import toast from 'react-hot-toast';

const UserLogin = () => {

   const [connection, setConnection] = useState(null);
   const [usernameInput, setUsernameInput] = useState('');
   const [currentUser, setCurrentUser] = useState(null);
   const [clients, setClients] = useState(null);

   useEffect(() => {
      const connection = new HubConnectionBuilder()
         .withUrl("https://localhost:5001/chathub")
         .withAutomaticReconnect([0, 0, 1000, 2000])
         .build();
      console.log('connectin')
      console.log(connection)
      setConnection(connection);
   }, []);

   useEffect(() => {
      console.log('trying')
      if (connection != null) {
         connection.start().then(() => {
            console.log('connected to signalR')
            connectionMethods()
         }).catch(err => {
            console.log(err)
            console.log('error while connecting')
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

   const connectionMethods = () => {


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

      connection.on("clientJoined", message => {
         toast(`Client ${message} joined`)
      })

      connection.on("currentUser", message => {
         toast.success(`Welcome ${message.username}`)
         setCurrentUser(message)
      })

      connection.on("clients", message => {
         // toast('Client: ' + message)
         console.log('Clients.........')
         console.log(message)
         setClients(message)

      })
   }

   const sendMessage = async () => {
      if (connection != null) {
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
   // const getClients = async () => {
   //    console.log('invoking get clients')
   //    await connection.invoke("GetClients");
   // };

   return (
      <div>
         <Header size='large' textAlign='center'>{currentUser?.username}</Header>
         <Header size='small' textAlign='center'>{currentUser?.connectionId}</Header>

         <Input onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput} placeholder="Enter username" ></Input>
         <br /> <br />
         <Button onClick={() => sendMessage()}>Giriş Yap</Button>
         <Divider />

         <List divided relaxed>
            {
               clients?.map((client) => (
                  <List.Item>
                     <List.Icon name='user' size='large' verticalAlign='middle' />
                     <List.Content>
                        <List.Header as='a'>{client.username}</List.Header>
                        <List.Description as='a'>{client.connectionId}</List.Description>
                     </List.Content>
                  </List.Item>
               ))
            }
         </List>

      </div>
   )
};

export default UserLogin;
