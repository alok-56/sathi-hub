import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  DollarSign
} from "lucide-react";

const sosServices = [
  {
    id: "SOS001",
    name: "Emergency Towing",
    description: "24/7 emergency vehicle towing service",
    price: "₹1,500",
    duration: "30 mins",
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SOS002", 
    name: "Battery Jump Start",
    description: "Quick battery jump start service",
    price: "₹500",
    duration: "15 mins",
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SOS003",
    name: "Flat Tyre Change",
    description: "Emergency tyre change assistance",
    price: "₹800",
    duration: "20 mins", 
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SOS004",
    name: "Emergency Fuel",
    description: "Emergency fuel delivery service",
    price: "₹300",
    duration: "25 mins",
    status: "inactive",
    createdDate: "2023-11-15"
  }
];

const getStatusBadge = (status: string) => {
  return status === 'active' 
    ? <Badge className="bg-success-light text-success border-success/20">Active</Badge>
    : <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">Inactive</Badge>;
};

export default function SOSServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredServices = sosServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
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