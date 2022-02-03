using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SignalRChattingProject.Data;
using SignalRChattingProject.Models;

namespace SignalRChattingProject.Hubs
{
   public class ChatHub : Hub
   {
      public async Task GetUsername(string username)
      {
         Client client = new Client { ConnectionId = Context.ConnectionId, Username = username };
         ClientSource.Clients.Add(client);
         await Clients.Others.SendAsync("clientJoined", username);
         await Clients.Caller.SendAsync("currentUser", client);
         await Clients.All.SendAsync("clients", ClientSource.Clients);
         await Clients.Caller.SendAsync("groups", GroupSource.Groups);
      }

      public async Task SendDirectMessage(string connectionId, string message)
      {
         await Clients.Client(connectionId).SendAsync("directMessage", message);
      }

      public async Task SendMessage(string message, string username)
      {
         Client senderClient = ClientSource.Clients.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);
         if (username == "Everyone")
         {
            await Clients.All.SendAsync("receiveMessage", message, senderClient.Username);
         }
         else
         {
            Client client = ClientSource.Clients.FirstOrDefault(c => c.Username == username);
            await Clients
               .Client(client.ConnectionId)
               .SendAsync("receiveMessage", message, senderClient.Username);
            await Clients.Caller.SendAsync("receiveMessage", message, senderClient.Username);
         }
      }

      public async Task AddGroup(string groupName)
      {
         await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
         var group = new Group
         {
            GroupName = groupName
         };
         var client = getContextClient();
         group.Clients.Add(client);
         GroupSource.Groups.Add(group);
         await Clients.All.SendAsync("groups", GroupSource.Groups);
      }

      public async Task AddClientToGroup(string groupName)
      {
         var group = GroupSource.Groups.FirstOrDefault(g => g.GroupName == groupName);
         var client = getContextClient();
         var isExistInGroup = group.Clients.Any(c => c.ConnectionId == Context.ConnectionId);
         if (!isExistInGroup)
         {
            group.Clients.Add(client);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.All.SendAsync("groups", GroupSource.Groups);
         }
      }

      public async Task SendMessageToGroup(string message, string groupName)
      {
         var client = getContextClient();
         await Clients.Group(groupName).SendAsync("receiveMessage", message, client.Username);
      }

      private Client getContextClient()
      {
         return ClientSource.Clients.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);
      }




      //public async Task GetClients()
      //{
      //	var clients = ClientSource.Clients;
      //	await Clients.All.SendAsync("clients", clients);
      //}
   }
}
