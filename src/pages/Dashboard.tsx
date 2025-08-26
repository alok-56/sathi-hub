import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Wrench, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  IndianRupee
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Total Bookings",
    value: "1,234",
    change: "+18%",
    trend: "up",
    icon: Calendar,
    color: "text-success"
  },
  {
    title: "Total Earnings",
    value: "₹5,67,890",
    change: "+23%",
    trend: "up",
    icon: IndianRupee,
    color: "text-info"
  },
  {
    title: "Today Earnings",
    value: "₹12,450",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    color: "text-warning"
  }
];

// Sample data for charts
const bookingData = [
  { day: 'Mon', bookings: 45, earnings: 12500 },
  { day: 'Tue', bookings: 52, earnings: 14200 },
  { day: 'Wed', bookings: 38, earnings: 9800 },
  { day: 'Thu', bookings: 61, earnings: 16700 },
  { day: 'Fri', bookings: 55, earnings: 15200 },
  { day: 'Sat', bookings: 67, earnings: 18900 },
  { day: 'Sun', bookings: 42, earnings: 11300 }
];

const earningsData = [
  { day: 'Mon', amount: 12500 },
  { day: 'Tue', amount: 14200 },
  { day: 'Wed', amount: 9800 },
  { day: 'Thu', amount: 16700 },
  { day: 'Fri', amount: 15200 },
  { day: 'Sat', amount: 18900 },
  { day: 'Sun', amount: 11300 }
];

const recentBookings = [
  {
    id: "BK001",
    customer: "Rajesh Kumar",
    service: "Oil Change",
    status: "completed",
    amount: "₹1,200",
    time: "2 hours ago"
  },
  {
    id: "BK002",
    customer: "Priya Sharma",
    service: "Brake Repair",
    status: "in-progress",
    amount: "₹2,800",
    time: "4 hours ago"
  },
  {
    id: "BK003",
    customer: "Mohammed Ali",
    service: "SOS Service",
    status: "pending",
    amount: "₹1,500",
    time: "6 hours ago"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-success-light text-success border-success/20">Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-info-light text-info border-info/20">In Progress</Badge>;
    case 'pending':
      return <Badge className="bg-warning-light text-warning border-warning/20">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Vehicle Sathi Admin Panel</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day-wise Bookings Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Bookings
            </CardTitle>
            <CardDescription>Booking trends for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Day-wise Earnings Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Daily Earnings
            </CardTitle>
            <CardDescription>Earnings trends for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Latest booking requests and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{booking.customer}</span>
                      <span className="text-sm text-muted-foreground">#{booking.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-xs text-muted-foreground">{booking.time}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-semibold">{booking.amount}</p>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start h-12">
              <Users className="w-4 h-4 mr-3" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <Wrench className="w-4 h-4 mr-3" />
              Approve Mechanics
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <CreditCard className="w-4 h-4 mr-3" />
              Process Payments
            </Button>
            <Button variant="outline" className="w-full justify-start h-12">
              <AlertTriangle className="w-4 h-4 mr-3" />
              SOS Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}