using System.Collections.Generic;
using System;

namespace SignalRChattingProject.Models
{
   public class Group
   {
      public string GroupName { get; set; }
      public List<Client> Clients { get; } = new List<Client>();
   }
}
