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
  AlertTriangle
} from "lucide-react";

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onEdit: () => void;
}

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

export function BookingDetailsModal({ open, onOpenChange, booking, onEdit }: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Booking Details</DialogTitle>
              <DialogDescription>Booking ID: {booking.id}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
              <Button size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
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
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {booking.phone}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {booking.location}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Information
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-medium">{booking.vehicle}</p>
            </div>
          </div>

          <Separator />

          {/* Service Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Service Information
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{booking.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mechanic</p>
                <p className="font-medium">
                  {booking.mechanic === "Unassigned" ? (
                    <Badge variant="outline">Unassigned</Badge>
                  ) : (
                    booking.mechanic
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {booking.date}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {booking.time}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold text-foreground">{booking.amount}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}