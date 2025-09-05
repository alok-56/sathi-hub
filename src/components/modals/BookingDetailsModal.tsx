import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Wrench, 
  IndianRupee,
  User,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  CreditCard,
  Package,
  Zap
} from "lucide-react";

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
 
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
    case 'ratinggiven':
      return <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        {status === 'ratinggiven' ? 'Rating Given' : 'Completed'}
      </Badge>;
    case 'accecpted':
    case 'arrived':
      return <Badge className="bg-info-light text-info border-info/20">
        <Clock className="w-3 h-3 mr-1" />
        {status === 'arrived' ? 'Arrived' : 'Accepted'}
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

export function BookingDetailsModal({ open, onOpenChange, booking }: BookingDetailsModalProps) {
  if (!booking) return null;

  const isServiceBooking = booking.bookingType === "services";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Booking Details</DialogTitle>
              <DialogDescription>
                Booking ID: {booking.id.slice(-8).toUpperCase()} • 
                <Badge variant="outline" className="ml-2 capitalize">
                  {booking.bookingType}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {booking.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {booking.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {booking.location}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {isServiceBooking ? <Wrench className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              {isServiceBooking ? "Service Information" : "Emergency Information"}
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              {isServiceBooking ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Services Requested</p>
                  <div className="space-y-2">
                    {booking.rawData?.services?.map((service: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-background rounded border">
                        <span className="font-medium">{service.servicename}</span>
                        <span className="font-semibold">₹{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">Problem Description</p>
                  <p className="font-medium text-lg">{booking.rawData?.problem}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned Mechanic</p>
                  <p className="font-medium">
                    {booking.mechanic === "Unassigned" ? (
                      <Badge variant="outline">Unassigned</Badge>
                    ) : (
                      booking.mechanic
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Date & Time</p>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4" />
                    {booking.date} at {booking.time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Payment Breakdown
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              {/* Service Charges */}
              <div className="space-y-2">
                {isServiceBooking ? (
                  <div className="flex justify-between">
                    <span>Service Cost</span>
                    <span>₹{booking.serviceCost}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>Price per KM</span>
                    <span>₹{booking.pricePerKm}/km</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Mechanic Charge</span>
                  <span>₹{booking.mechanicCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{booking.platformFee}</span>
                </div>
                {booking.additionalServiceCost > 0 && (
                  <div className="flex justify-between">
                    <span>Additional Services</span>
                    <span>₹{booking.additionalServiceCost}</span>
                  </div>
                )}
                {booking.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{booking.discount}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Total & Payment Status */}
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{booking.rawData?.payment_details?.totalamount}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Paid Amount</span>
                  <span>₹{booking.rawData?.payment_details?.paidamount}</span>
                </div>
                {booking.rawData?.payment_details?.dueamount > 0 && (
                  <div className="flex justify-between text-destructive font-medium">
                    <span>Due Amount</span>
                    <span>₹{booking.rawData?.payment_details?.dueamount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
                  <Badge variant={booking.paymentStatus === "paid" ? "default" : "destructive"}>
                    <CreditCard className="w-3 h-3 mr-1" />
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          {booking.reviewStar > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Customer Rating
                </h3>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < booking.reviewStar ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-lg">{booking.reviewStar}/5</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Booking Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Booking Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{booking.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{booking.updatedAt}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}