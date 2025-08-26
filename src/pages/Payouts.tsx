import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  DollarSign, 
  Eye, 
  Download,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar
} from "lucide-react";

const payouts = [
  {
    id: "PO001",
    mechanic: "Suresh Patil",
    mechanicId: "MECH001",
    amount: "₹8,500",
    commission: "₹1,500",
    netAmount: "₹7,000",
    bookingsCount: 5,
    period: "Jan 1-15, 2024",
    status: "completed",
    paidDate: "2024-01-16",
    method: "Bank Transfer"
  },
  {
    id: "PO002",
    mechanic: "Ramesh Singh",
    mechanicId: "MECH002",
    amount: "₹12,300",
    commission: "₹2,300",
    netAmount: "₹10,000",
    bookingsCount: 8,
    period: "Jan 1-15, 2024",
    status: "pending",
    paidDate: null,
    method: "UPI"
  },
  {
    id: "PO003",
    mechanic: "Ganesh Rao",
    mechanicId: "MECH004",
    amount: "₹15,600",
    commission: "₹2,800",
    netAmount: "₹12,800",
    bookingsCount: 12,
    period: "Dec 16-31, 2023",
    status: "completed",
    paidDate: "2024-01-02",
    method: "Bank Transfer"
  },
  {
    id: "PO004",
    mechanic: "Vikash Kumar",
    mechanicId: "MECH003",
    amount: "₹6,700",
    commission: "₹1,200",
    netAmount: "₹5,500",
    bookingsCount: 4,
    period: "Jan 1-15, 2024",
    status: "pending",
    paidDate: null,
    method: "UPI"
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
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Payouts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.mechanic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.mechanicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayouts.reduce((sum, payout) => {
    return sum + parseFloat(payout.netAmount.replace('₹', '').replace(',', ''));
  }, 0);

  const pendingAmount = filteredPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, payout) => {
      return sum + parseFloat(payout.netAmount.replace('₹', '').replace(',', ''));
    }, 0);

  const handleProcessPayout = (payoutId: string) => {
    console.log("Process payout:", payoutId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payouts</h1>
          <p className="text-muted-foreground mt-1">Manage mechanic payouts and commissions</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <Download className="w-4 h-4 mr-2" />
          Export Payouts
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                <p className="text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">This period</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredPayouts.filter(p => p.status === 'pending').length} payouts
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
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">
                  {filteredPayouts.filter(p => p.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">This period</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
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
                  placeholder="Search by mechanic name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payouts ({filteredPayouts.length})
          </CardTitle>
          <CardDescription>Mechanic payout history and pending payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Mechanic</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayouts.map((payout) => (
                  <TableRow key={payout.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{payout.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payout.mechanic}</div>
                        <div className="text-sm text-muted-foreground">{payout.mechanicId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{payout.period}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payout.bookingsCount}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{payout.amount}</TableCell>
                    <TableCell className="text-destructive">-{payout.commission}</TableCell>
                    <TableCell className="font-semibold text-success">{payout.netAmount}</TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payout.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleProcessPayout(payout.id)}
                            className="text-primary hover:text-primary"
                            title="Process Payout"
                          >
                            <CreditCard className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}