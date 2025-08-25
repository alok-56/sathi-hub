import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";

const vehicleModels = [
  {
    id: "VM001",
    brand: "Maruti Suzuki",
    model: "Swift",
    variant: "VXI",
    fuelType: "Petrol",
    transmission: "Manual",
    engineCapacity: "1.2L",
    status: "active",
    registeredVehicles: 145,
    createdDate: "2023-12-01"
  },
  {
    id: "VM002",
    brand: "Hyundai",
    model: "i20",
    variant: "Sportz",
    fuelType: "Petrol",
    transmission: "Automatic",
    engineCapacity: "1.2L",
    status: "active",
    registeredVehicles: 98,
    createdDate: "2023-12-01"
  },
  {
    id: "VM003",
    brand: "Honda",
    model: "City",
    variant: "VX",
    fuelType: "Petrol",
    transmission: "CVT",
    engineCapacity: "1.5L",
    status: "active",
    registeredVehicles: 76,
    createdDate: "2023-12-01"
  },
  {
    id: "VM004",
    brand: "Tata",
    model: "Nexon",
    variant: "XZ+",
    fuelType: "Electric",
    transmission: "Automatic",
    engineCapacity: "Electric",
    status: "active",
    registeredVehicles: 34,
    createdDate: "2023-11-15"
  },
  {
    id: "VM005",
    brand: "Mahindra",
    model: "XUV300",
    variant: "W8(O)",
    fuelType: "Diesel",
    transmission: "Manual",
    engineCapacity: "1.5L",
    status: "inactive",
    registeredVehicles: 12,
    createdDate: "2023-10-20"
  }
];

const getStatusBadge = (status: string) => {
  return status === 'active' 
    ? <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    : <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>;
};

const getFuelTypeBadge = (fuelType: string) => {
  const colors = {
    'Petrol': 'bg-blue-100 text-blue-700',
    'Diesel': 'bg-orange-100 text-orange-700',
    'Electric': 'bg-green-100 text-green-700',
    'CNG': 'bg-purple-100 text-purple-700'
  };
  
  return (
    <Badge className={colors[fuelType as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
      {fuelType}
    </Badge>
  );
};

const getTransmissionBadge = (transmission: string) => {
  const colors = {
    'Manual': 'bg-gray-100 text-gray-700',
    'Automatic': 'bg-indigo-100 text-indigo-700',
    'CVT': 'bg-teal-100 text-teal-700'
  };
  
  return (
    <Badge className={colors[transmission as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
      {transmission}
    </Badge>
  );
};

export default function VehicleModels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredModels = vehicleModels.filter(model => 
    model.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.variant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Models</h1>
          <p className="text-muted-foreground mt-1">Manage supported vehicle models</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold text-foreground">{filteredModels.length}</p>
              </div>
              <Car className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold text-success">
                  {filteredModels.filter(m => m.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Electric Models</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredModels.filter(m => m.fuelType === 'Electric').length}
                </p>
              </div>
              <Car className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold text-info">
                  {filteredModels.reduce((sum, model) => sum + model.registeredVehicles, 0)}
                </p>
              </div>
              <Car className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Add New Vehicle Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Brand (e.g., Maruti Suzuki)" />
              <Input placeholder="Model (e.g., Swift)" />
              <Input placeholder="Variant (e.g., VXI)" />
              <Input placeholder="Fuel Type (Petrol/Diesel/Electric)" />
              <Input placeholder="Transmission (Manual/Automatic)" />
              <Input placeholder="Engine Capacity (e.g., 1.2L)" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Add Model</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <Input
            placeholder="Search vehicle models by brand, model, or variant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11"
          />
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Vehicle Models ({filteredModels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Vehicle Details</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Transmission</TableHead>
                <TableHead>Engine</TableHead>
                <TableHead>Registered Vehicles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{model.brand} {model.model}</div>
                      <div className="text-sm text-muted-foreground">{model.variant}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getFuelTypeBadge(model.fuelType)}</TableCell>
                  <TableCell>{getTransmissionBadge(model.transmission)}</TableCell>
                  <TableCell className="font-mono text-sm">{model.engineCapacity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {model.registeredVehicles}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(model.status)}</TableCell>
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