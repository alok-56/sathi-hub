import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, AlertTriangle, Car, Bike } from "lucide-react";
import { sosService } from "@/services/sosServices";
import { SOSService } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SOSServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<SOSService | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<SOSService[]>([]);
  const [newService, setNewService] = useState({
    servicename: "",
    vehicle_type: "",
    price: 0,
    image: ""
  });
  
  const { toast } = useToast();

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await sosService.getSOSServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error loading SOS services:', error);
      toast({
        title: "Error",
        description: "Failed to load SOS services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreateService = async () => {
    if (!newService.servicename || !newService.vehicle_type || !newService.price) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingService) {
        await sosService.updateSOSService({
          id: editingService._id,
          servicename: newService.servicename,
          vehicle_type: newService.vehicle_type,
          price: newService.price,
          image: newService.image
        });
        toast({
          title: "Success",
          description: "SOS service updated successfully",
        });
      } else {
        await sosService.createSOSService({
          servicename: newService.servicename,
          vehicle_type: newService.vehicle_type,
          price: newService.price,
          image: newService.image
        });
        toast({
          title: "Success",
          description: "SOS service created successfully",
        });
      }
      
      setNewService({ servicename: "", vehicle_type: "", price: 0, image: "" });
      setEditingService(null);
      setShowCreateModal(false);
      loadServices();
    } catch (error) {
      console.error('Error saving SOS service:', error);
      toast({
        title: "Error",
        description: "Failed to save SOS service",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = (service: SOSService) => {
    setEditingService(service);
    setNewService({
      servicename: service.servicename,
      vehicle_type: service.vehicle_type,
      price: service.price,
      image: service.image
    });
    setShowCreateModal(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SOS service?")) return;

    try {
      await sosService.deleteSOSService(id);
      toast({
        title: "Success",
        description: "SOS service deleted successfully",
      });
      loadServices();
    } catch (error) {
      console.error('Error deleting SOS service:', error);
      toast({
        title: "Error",
        description: "Failed to delete SOS service",
        variant: "destructive",
      });
    }
  };

  const getVehicleIcon = (type: string) => {
    return type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />;
  };

  const getVehicleBadge = (type: string) => {
    return (
      <Badge variant={type === "car" ? "default" : "secondary"} className="flex items-center gap-1">
        {getVehicleIcon(type)}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const filteredServices = services.filter(service =>
    service.servicename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SOS Services</h1>
          <p className="text-muted-foreground mt-1">Manage emergency services</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Add New SOS Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Service Name" />
              <Input placeholder="Price (₹)" />
              <Input placeholder="Duration" />
              <Textarea placeholder="Service Description" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Create Service</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <Input
            placeholder="Search SOS services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11"
          />
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            SOS Services ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell className="font-semibold">{service.price}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}