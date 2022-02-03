import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './chattingTemplate.css'
import { Divider } from 'semantic-ui-react';

const ClientsSidebar = (props) => {
   return (

      <div className="col-md-4 border-right">
         <div className="friend-drawer">
            <img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg" alt="Profile img" />
            <div className="text">

               <h6>{props.currentUser?.username}</h6>
               <p className="text-muted">{props.currentUser?.connectionId}</p>
            </div>
         </div>
         <div className="search-box">
            <div className="input-wrapper">
               <SearchIcon />
               <input placeholder="Search here" type="text" />
            </div>
         </div>
         <div >
            <div onClick={() => props.setTargetUserFunc(null)} className="friend-drawer friend-drawer--onhover">
               {/* <img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" /> */}
               <div className="text">
                  <h6>Everyone</h6>
               </div>
               <span className="time text-muted small">13:21</span>
            </div>
         </div>
         <Divider />
         {props.clients?.map(client => (
            <div key={client.connectionId}>
               <div onClick={() => props.setTargetUserFunc(client)} className="friend-drawer friend-drawer--onhover">
                  <img className="profile-image" src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg" alt="" />
                  <div className="text">
                     <h6>{client.username}</h6>
                     <p className="text-muted">{client.connectionId}</p>
                  </div>
                  <span className="time text-muted small">13:21</span>
               </div>
               <Divider />

            </div>
         ))}
         {props.groups?.map(group => (
            <div key={group.groupName}>
               <div onClick={() => props.setTargetUserFunc(group)} className="friend-drawer friend-drawer--onhover">
                  <div className="text">
                     <h6>{group.groupName}</h6>
                  </div>
                  {/* <span className="time text-muted small">13:21</span> */}
               </div>
               <Divider />
            </div>
         ))}

      </div>
   );
};

export default ClientsSidebar;
