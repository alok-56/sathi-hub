import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  CreditCard, 
  Eye, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  DollarSign
} from "lucide-react";

const payments = [
  {
    id: "PAY001",
    bookingId: "BK001",
    customer: "Rajesh Kumar",
    amount: "₹1,200",
    method: "UPI",
    transactionId: "TXN123456789",
    status: "completed",
    date: "2024-01-15",
    time: "10:30 AM",
    gatewayFee: "₹12"
  },
  {
    id: "PAY002",
    bookingId: "BK002",
    customer: "Priya Sharma",
    amount: "₹2,800",
    method: "Card",
    transactionId: "TXN987654321",
    status: "completed",
    date: "2024-01-15",
    time: "02:45 PM",
    gatewayFee: "₹28"
  },
  {
    id: "PAY003",
    bookingId: "BK003",
    customer: "Mohammed Ali",
    amount: "₹3,500",
    method: "Wallet",
    transactionId: "TXN456789123",
    status: "pending",
    date: "2024-01-15",
    time: "04:15 PM",
    gatewayFee: "₹35"
  },
  {
    id: "PAY004",
    bookingId: "BK004",
    customer: "Sneha Patel",
    amount: "₹4,200",
    method: "UPI",
    transactionId: "TXN789123456",
    status: "failed",
    date: "2024-01-14",
    time: "11:20 AM",
    gatewayFee: "₹0"
  },
  {
    id: "PAY005",
    bookingId: "BK005",
    customer: "Arjun Reddy",
    amount: "₹8,500",
    method: "Card",
    transactionId: "TXN321654987",
    status: "refunded",
    date: "2024-01-14",
    time: "09:30 AM",
    gatewayFee: "₹85"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </Badge>;
    case 'pending':
      return <Badge className="bg-warning-light text-warning border-warning/20">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>;
    case 'failed':
      return <Badge className="bg-destructive-light text-destructive border-destructive/20">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>;
    case 'refunded':
      return <Badge className="bg-info-light text-info border-info/20">
        <RefreshCw className="w-3 h-3 mr-1" />
        Refunded
      </Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getMethodBadge = (method: string) => {
  const colors = {
    'UPI': 'bg-purple-100 text-purple-700 border-purple-200',
    'Card': 'bg-blue-100 text-blue-700 border-blue-200',
    'Wallet': 'bg-green-100 text-green-700 border-green-200'
  };
  
  return (
    <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
      {method}
    </Badge>
  );
};

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => {
    return sum + parseFloat(payment.amount.replace('₹', '').replace(',', ''));
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Monitor all payment transactions</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <Download className="w-4 h-4 mr-2" />
          Export Payments
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">
                  {filteredPayments.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  {filteredPayments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">
                  {filteredPayments.filter(p => p.status === 'failed').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by customer, booking ID, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Transactions ({filteredPayments.length})
          </CardTitle>
          <CardDescription>All payment transactions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.bookingId}</Badge>
                    </TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell className="font-semibold">{payment.amount}</TableCell>
                    <TableCell>{getMethodBadge(payment.method)}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{payment.date}</div>
                        <div className="text-xs text-muted-foreground">{payment.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
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