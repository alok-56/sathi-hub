import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  DollarSign
} from "lucide-react";

const regularServices = [
  {
    id: "REG001",
    name: "Oil Change",
    description: "Complete engine oil change with filter",
    price: "₹1,200",
    duration: "45 mins",
    category: "Engine",
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "REG002", 
    name: "Brake Pad Replacement",
    description: "Front and rear brake pad replacement",
    price: "₹2,800",
    duration: "90 mins",
    category: "Brakes",
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "REG003",
    name: "AC Service",
    description: "Complete AC cleaning and gas refill",
    price: "₹1,800",
    duration: "60 mins",
    category: "AC",
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "REG004",
    name: "Battery Replacement",
    description: "Car battery replacement with warranty",
    price: "₹3,500",
    duration: "30 mins",
    category: "Electrical",
    status: "inactive",
    createdDate: "2023-11-15"
  },
  {
    id: "REG005",
    name: "Tyre Replacement",
    description: "Premium tyre replacement service",
    price: "₹8,500",
    duration: "40 mins",
    category: "Tyres",
    status: "active", 
    createdDate: "2023-12-01"
  }
];

const getStatusBadge = (status: string) => {
  return status === 'active' 
    ? <Badge className="bg-success-light text-success border-success/20">Active</Badge>
    : <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">Inactive</Badge>;
};

const getCategoryBadge = (category: string) => {
  const colors = {
    'Engine': 'bg-blue-100 text-blue-700',
    'Brakes': 'bg-red-100 text-red-700',
    'AC': 'bg-cyan-100 text-cyan-700',
    'Electrical': 'bg-yellow-100 text-yellow-700',
    'Tyres': 'bg-purple-100 text-purple-700'
  };
  
  return (
    <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
      {category}
    </Badge>
  );
};

export default function RegularServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredServices = regularServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Regular Services</h1>
          <p className="text-muted-foreground mt-1">Manage regular maintenance services</p>
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
            <CardTitle>Add New Regular Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Service Name" />
              <Input placeholder="Price (₹)" />
              <Input placeholder="Duration" />
              <Input placeholder="Category" />
              <div className="md:col-span-2">
                <Textarea placeholder="Service Description" />
              </div>
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
            placeholder="Search regular services..."
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
            <Settings className="w-5 h-5" />
            Regular Services ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
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
                  <TableCell>{getCategoryBadge(service.category)}</TableCell>
                  <TableCell className="max-w-xs truncate">{service.description}</TableCell>
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