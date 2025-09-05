import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationComponent } from "@/components/PaginationComponent";
import { BookingDetailsModal } from "@/components/modals/BookingDetailsModal";

import { 
  Search, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Loader2
} from "lucide-react";
import { bookingService } from "@/services/bookings";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
    case 'ratinggiven':
      return <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </Badge>;
    case 'accecpted':
    case 'arrived':
      return <Badge className="bg-info-light text-info border-info/20">
        <Clock className="w-3 h-3 mr-1" />
        In Progress
      </Badge>;
    case 'pending':
      return <Badge className="bg-warning-light text-warning border-warning/20">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Pending
      </Badge>;
    case 'userconform':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        User Confirmed
      </Badge>;
    case 'cancelled':
      return <Badge className="bg-destructive-light text-destructive border-destructive/20">
        <XCircle className="w-3 h-3 mr-1" />
        Cancelled
      </Badge>;
    default:
      return <Badge variant="secondary" className="capitalize">{status}</Badge>;
  }
};

// Transform API data to match component expectations
const transformBookingData = (apiBooking: any) => {
  const servicesList = apiBooking.services?.length > 0 
    ? apiBooking.services.map((s: any) => `${s.servicename} (₹${s.price})`).join(", ")
    : apiBooking.problem 
      ? `Emergency: ${apiBooking.problem}` 
      : "N/A";
  
  // Get payment summary based on booking type
  const paymentSummary = apiBooking.bookingtype === "services" 
    ? apiBooking.payment_ser_summary 
    : apiBooking.payment_emerg_summary;
  
  const totalAmount = apiBooking.payment_details?.totalamount || 0;
  const paidAmount = apiBooking.payment_details?.paidamount || 0;
  const dueAmount = apiBooking.payment_details?.dueamount || 0;
  const discount = apiBooking.payment_details?.discount || 0;

  // Extract location from coordinates if available
  const location = apiBooking.userLocation?.coordinates 
    ? `${apiBooking.userLocation.coordinates[1].toFixed(4)}, ${apiBooking.userLocation.coordinates[0].toFixed(4)}`
    : "N/A";

  return {
    id: apiBooking._id,
    customer: apiBooking.userid?.name || "N/A",
    phone: apiBooking.userid?.phone_number || "N/A",
    email: apiBooking.userid?.email || "N/A",
    vehicle: "Vehicle Info N/A", // Vehicle info not in API response
    service: servicesList,
    mechanic: apiBooking.mechanicid?.name || "Unassigned",
    mechanicId: apiBooking.mechanicid?._id || null,
    date: apiBooking.service_date ? new Date(apiBooking.service_date).toLocaleDateString('en-IN') : 
          new Date(apiBooking.createdAt).toLocaleDateString('en-IN'),
    time: apiBooking.service_date ? new Date(apiBooking.service_date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }) : new Date(apiBooking.createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    amount: `₹${totalAmount}`,
    paidAmount: `₹${paidAmount}`,
    dueAmount: `₹${dueAmount}`,
    discount: discount,
    status: apiBooking.status,
    location: location,
    bookingType: apiBooking.bookingtype,
    paymentStatus: apiBooking.payment_status,
    reviewStar: apiBooking.reviewstar || 0,
    // Payment summary fields based on booking type
    platformFee: paymentSummary?.platform_fee || 0,
    mechanicCharge: paymentSummary?.mechanic_charge || 0,
    serviceCost: paymentSummary?.service_cost || 0, // Only for services
    pricePerKm: paymentSummary?.price_per_km || 0, // Only for emergency
    additionalServiceCost: paymentSummary?.additional_service_cost || 0,
    createdAt: new Date(apiBooking.createdAt).toLocaleString('en-IN'),
    updatedAt: new Date(apiBooking.updatedAt).toLocaleString('en-IN'),
    rawData: apiBooking // Keep original data for modals
  };
};

export default function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const itemsPerPage = 10;

  // Fetch bookings from API with improved pagination handling
  const fetchBookings = async (page = 1, status = statusFilter, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page,
        limit: itemsPerPage
      };

      if (status !== "all") {
        params.status = status;
      }

      // Add search parameter if needed (depends on your API)
      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await bookingService.getBookings(params);
      
      if (response.status) {
        const transformedBookings = response.data.map(transformBookingData);
        setBookingsData(transformedBookings);
        setTotalBookings(response.total);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setCurrentPage(1);
        fetchBookings(1, statusFilter, searchTerm);
      } else if (searchTerm === "") {
        // Reset to show all when search is cleared
        setCurrentPage(1);
        fetchBookings(1, statusFilter, "");
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter bookings based on search term (client-side filtering for current page as fallback)
  const filteredBookings = bookingsData.filter(booking => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return booking.customer.toLowerCase().includes(searchLower) ||
           booking.id.toLowerCase().includes(searchLower) ||
           booking.service.toLowerCase().includes(searchLower) ||
           booking.mechanic.toLowerCase().includes(searchLower);
  });

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchBookings(1, status, searchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchBookings(page, statusFilter, searchTerm);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleExportData = () => {
    // Export functionality - could call API to get all data
    console.log("Exporting booking data...");
  };

  const handleRefresh = () => {
    fetchBookings(currentPage, statusFilter, searchTerm);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Bookings</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all service bookings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Refresh
          </Button>
          {/* <Button 
            className="bg-gradient-to-r from-primary to-primary-hover"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button> */}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by customer, booking ID, service, or mechanic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accecpted">Accepted</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="userconform">User Confirmed</SelectItem>
                  <SelectItem value="ratinggiven">Rating Given</SelectItem>
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
            All Bookings ({totalBookings})
          </CardTitle>
          <CardDescription>
            View and manage service bookings - Page {currentPage} of {totalPages}
            {searchTerm && ` (Filtered by: "${searchTerm}")`}
            {statusFilter !== "all" && ` (Status: ${statusFilter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service/Problem</TableHead>
                      <TableHead>Mechanic</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          {searchTerm || statusFilter !== "all" 
                            ? "No bookings found matching your criteria" 
                            : "No bookings available"
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {booking.id.slice(-8).toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{booking.customer}</div>
                            <div className="text-xs text-muted-foreground">{booking.phone}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs truncate" title={booking.service}>
                              {booking.service}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {booking.bookingType}
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.mechanic === "Unassigned" ? (
                              <Badge variant="outline">Unassigned</Badge>
                            ) : (
                              <div className="font-medium">{booking.mechanic}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{booking.date}</div>
                            <div className="text-xs text-muted-foreground">{booking.time}</div>
                          </TableCell>
                          <TableCell className="font-semibold">{booking.amount}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDetails(booking)}
                              className="hover:bg-primary/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalBookings)} of {totalBookings} bookings
                  </div>
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={currentPage < totalPages}
                    hasPreviousPage={currentPage > 1}
                  />
                </div>
              )}

              {/* Results summary when no pagination */}
              {totalPages <= 1 && filteredBookings.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Showing {filteredBookings.length} of {totalBookings} bookings
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Modal Only */}
      <BookingDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        booking={selectedBooking}
      />
    </div>
  );
}