import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Bell, 
  Send, 
  Eye,
  Plus,
  Users,
  UserCheck,
  Smartphone,
  Mail,
  Calendar
} from "lucide-react";

const notifications = [
  {
    id: "NOT001",
    title: "Service Booking Confirmed",
    message: "Your service booking has been confirmed for tomorrow at 10:00 AM",
    recipient: "All Users",
    type: "booking",
    channel: "push",
    status: "sent",
    sentDate: "2024-01-15",
    sentTime: "09:30 AM",
    delivered: 2847,
    opened: 1523
  },
  {
    id: "NOT002",
    title: "New Mechanic Available",
    message: "A new certified mechanic is now available in your area",
    recipient: "Mumbai Users",
    type: "promotion",
    channel: "email",
    status: "scheduled",
    sentDate: "2024-01-16",
    sentTime: "10:00 AM",
    delivered: 0,
    opened: 0
  },
  {
    id: "NOT003",
    title: "Payment Successful",
    message: "Your payment of ₹1,200 has been processed successfully",
    recipient: "Rajesh Kumar",
    type: "payment",
    channel: "sms",
    status: "sent",
    sentDate: "2024-01-15",
    sentTime: "02:45 PM",
    delivered: 1,
    opened: 1
  },
  {
    id: "NOT004",
    title: "Service Reminder",
    message: "Your vehicle service is due next week. Book now to avoid any issues.",
    recipient: "All Users",
    type: "reminder",
    channel: "push",
    status: "draft",
    sentDate: null,
    sentTime: null,
    delivered: 0,
    opened: 0
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'sent':
      return <Badge className="bg-success-light text-success border-success/20">Sent</Badge>;
    case 'scheduled':
      return <Badge className="bg-info-light text-info border-info/20">Scheduled</Badge>;
    case 'draft':
      return <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">Draft</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  const colors = {
    'booking': 'bg-blue-100 text-blue-700',
    'promotion': 'bg-green-100 text-green-700',
    'payment': 'bg-purple-100 text-purple-700',
    'reminder': 'bg-orange-100 text-orange-700'
  };
  
  return (
    <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'push':
      return <Smartphone className="w-4 h-4" />;
    case 'email':
      return <Mail className="w-4 h-4" />;
    case 'sms':
      return <Smartphone className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    recipient: "all",
    type: "general",
    channel: "push"
  });

  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create notification:", newNotification);
    setShowCreateForm(false);
    setNewNotification({
      title: "",
      message: "",
      recipient: "all",
      type: "general",
      channel: "push"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Send and manage notifications to users</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Create Notification Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Create New Notification
            </CardTitle>
            <CardDescription>Send notifications to users or mechanics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Notification title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient</label>
                  <Select 
                    value={newNotification.recipient} 
                    onValueChange={(value) => setNewNotification({...newNotification, recipient: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="mechanics">All Mechanics</SelectItem>
                      <SelectItem value="mumbai">Mumbai Users</SelectItem>
                      <SelectItem value="delhi">Delhi Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Notification message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Channel</label>
                  <Select 
                    value={newNotification.channel} 
                    onValueChange={(value) => setNewNotification({...newNotification, channel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
                <Button type="button" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="relative">
            <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notifications ({filteredNotifications.length})
          </CardTitle>
          <CardDescription>View and manage sent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {notification.message}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {notification.recipient}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getChannelIcon(notification.channel)}
                        <span className="capitalize">{notification.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell>
                      {notification.sentDate ? (
                        <div>
                          <div className="text-sm">{notification.sentDate}</div>
                          <div className="text-xs text-muted-foreground">{notification.sentTime}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {notification.delivered > 0 ? (
                        <div className="text-sm">
                          <div>{notification.delivered} delivered</div>
                          <div className="text-xs text-muted-foreground">{notification.opened} opened</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}