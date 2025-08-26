import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Calendar, 
  Wrench, 
  Clock,
  CheckCircle,
  X,
  Ban,
  Trash2
} from "lucide-react";

interface MechanicDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mechanic: any;
  onBlock: () => void;
  onDelete: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>;
    case 'pending':
      return <Badge className="bg-warning-light text-warning border-warning/20">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>;
    case 'rejected':
      return <Badge className="bg-destructive-light text-destructive border-destructive/20">
        <X className="w-3 h-3 mr-1" />
        Rejected
      </Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function MechanicDetailsModal({ open, onOpenChange, mechanic, onBlock, onDelete }: MechanicDetailsModalProps) {
  if (!mechanic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Mechanic Details</DialogTitle>
              <DialogDescription>Mechanic ID: {mechanic.id}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(mechanic.status)}
              <Button size="sm" variant="outline" onClick={onBlock} className="text-warning hover:text-warning">
                <Ban className="w-4 h-4 mr-2" />
                Block
              </Button>
              <Button size="sm" variant="outline" onClick={onDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mechanic.avatar} alt={mechanic.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                  {mechanic.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-semibold">{mechanic.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {mechanic.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {mechanic.email}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {mechanic.location}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Professional Information
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="font-medium">{mechanic.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{mechanic.experience}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mechanic.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <p className="font-medium">{mechanic.completedJobs}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{mechanic.joinDate}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(mechanic.status)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Performance Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success-light rounded-lg">
                <p className="text-2xl font-bold text-success">{mechanic.completedJobs}</p>
                <p className="text-sm text-success-foreground">Completed Jobs</p>
              </div>
              <div className="text-center p-4 bg-warning-light rounded-lg">
                <p className="text-2xl font-bold text-warning">{mechanic.rating}</p>
                <p className="text-sm text-warning-foreground">Average Rating</p>
              </div>
              <div className="text-center p-4 bg-info-light rounded-lg">
                <p className="text-2xl font-bold text-info">{mechanic.experience}</p>
                <p className="text-sm text-info-foreground">Experience</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}