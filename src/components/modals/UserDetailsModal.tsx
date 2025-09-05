import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/api";
import { 
  Mail, 
  Phone, 
  Wallet, 
  Calendar, 
  Hash, 
  Car,
  UserCheck,
  UserX
} from "lucide-react";

interface ViewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

export function ViewUserModal({ open, onOpenChange, user }: ViewUserModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Profile */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">ID: {user._id}</p>
              <div className="flex items-center gap-2 mt-2">
                {user.isBlocked ? (
                  <Badge className="bg-destructive-light text-destructive border-destructive/20">
                    <UserX className="w-3 h-3 mr-1" />
                    Blocked
                  </Badge>
                ) : (
                  <Badge className="bg-success-light text-success border-success/20">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h4>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Account Details</h4>
              
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Wallet Balance</p>
                  <p className="text-sm text-muted-foreground font-semibold">{formatCurrency(user.wallet_amount)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Referral Code</p>
                  <p className="text-sm text-muted-foreground font-mono">{user.referral_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Types */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Vehicle Types</h4>
            <div className="flex items-center gap-3">
              <Car className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {user.vehicle_type.map((vehicle, index) => (
                  <Badge key={index} variant="outline">
                    {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          {user.socketId && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Connection</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Currently Online</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}