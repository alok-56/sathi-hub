import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationComponent } from "@/components/PaginationComponent";
import { usePagination } from "@/hooks/usePagination";
import { BookingDetailsModal } from "@/components/modals/BookingDetailsModal";
import { EditBookingModal } from "@/components/modals/EditBookingModal";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from "lucide-react";

const bookings = [
  {
    id: "BK001",
    customer: "Rajesh Kumar",
    phone: "+91 98765 43210",
    vehicle: "Honda City - MH 01 AB 1234",
    service: "Oil Change + Filter",
    mechanic: "Suresh Patil",
    date: "2024-01-15",
    time: "10:00 AM",
    amount: "₹1,200",
    status: "completed",
    location: "Andheri, Mumbai"
  },
  {
    id: "BK002",
    customer: "Priya Sharma",
    phone: "+91 87654 32109",
    vehicle: "Maruti Swift - DL 02 CD 5678",
    service: "Brake Pad Replacement",
    mechanic: "Ramesh Singh",
    date: "2024-01-15",
    time: "02:30 PM",
    amount: "₹2,800",
    status: "in-progress",
    location: "Sector 18, Noida"
  },
  {
    id: "BK003",
    customer: "Mohammed Ali",
    phone: "+91 76543 21098",
    vehicle: "Hyundai i20 - KA 03 EF 9012",
    service: "Battery Replacement",
    mechanic: "Unassigned",
    date: "2024-01-15",
    time: "04:00 PM",
    amount: "₹3,500",
    status: "pending",
    location: "Koramangala, Bangalore"
  },
  {
    id: "BK004",
    customer: "Sneha Patel",
    phone: "+91 65432 10987",
    vehicle: "Tata Nexon - GJ 04 GH 3456",
    service: "AC Repair",
    mechanic: "Vikash Kumar",
    date: "2024-01-14",
    time: "11:00 AM",
    amount: "₹4,200",
    status: "cancelled",
    location: "Satellite, Ahmedabad"
  },
  {
    id: "BK005",
    customer: "Arjun Reddy",
    phone: "+91 54321 09876",
    vehicle: "Mahindra XUV - TS 05 IJ 7890",
    service: "Tyre Replacement",
    mechanic: "Ganesh Rao",
    date: "2024-01-14",
    time: "09:15 AM",
    amount: "₹8,500",
    status: "completed",
    location: "Jubilee Hills, Hyderabad"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </Badge>;
    case 'in-progress':
      return <Badge className="bg-info-light text-info border-info/20">
        <Clock className="w-3 h-3 mr-1" />
        In Progress
      </Badge>;
    case 'pending':
      return <Badge className="bg-warning-light text-warning border-warning/20">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Pending
      </Badge>;
    case 'cancelled':
      return <Badge className="bg-destructive-light text-destructive border-destructive/20">
        <XCircle className="w-3 h-3 mr-1" />
        Cancelled
      </Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState(bookings);

  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage, 
    hasNextPage, 
    hasPreviousPage 
  } = usePagination({
    totalItems: filteredBookings.length,
    itemsPerPage: 10
  });

  const currentBookings = filteredBookings.slice(paginatedData.startIndex, paginatedData.endIndex);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleEditBooking = () => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveBooking = (updatedBooking: any) => {
    setBookingsData(prev => prev.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all service bookings</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by customer, booking ID, or vehicle..."
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
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            All Bookings ({filteredBookings.length})
          </CardTitle>
          <CardDescription>View and manage service bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Mechanic</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer}</div>
                        <div className="text-sm text-muted-foreground">{booking.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{booking.vehicle}</div>
                    </TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>
                      {booking.mechanic === "Unassigned" ? (
                        <Badge variant="outline">Unassigned</Badge>
                      ) : (
                        booking.mechanic
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{booking.date}</div>
                        <div className="text-xs text-muted-foreground">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{booking.amount}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                          <Edit className="w-4 h-4" />
                        </Button>
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

      {/* Modals */}
      <BookingDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        booking={selectedBooking}
        onEdit={handleEditBooking}
      />

      <EditBookingModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        booking={selectedBooking}
        onSave={handleSaveBooking}
      />
    </div>
  );
}