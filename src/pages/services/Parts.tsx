import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const parts = [
  {
    id: "PART001",
    name: "Engine Oil Filter",
    brand: "Bosch",
    partNumber: "F026407006",
    category: "Engine",
    price: "₹450",
    stock: 25,
    minStock: 10,
    status: "available",
    createdDate: "2023-12-01"
  },
  {
    id: "PART002", 
    name: "Brake Pads (Front)",
    brand: "Brembo",
    partNumber: "P85020",
    category: "Brakes",
    price: "₹2,200",
    stock: 8,
    minStock: 5,
    status: "available",
    createdDate: "2023-12-01"
  },
  {
    id: "PART003",
    name: "Car Battery 12V",
    brand: "Exide",
    partNumber: "EX44L",
    category: "Electrical",
    price: "₹3,800",
    stock: 3,
    minStock: 5,
    status: "low-stock",
    createdDate: "2023-12-01"
  },
  {
    id: "PART004",
    name: "Air Filter",
    brand: "Mann",
    partNumber: "C2774",
    category: "Engine",
    price: "₹680",
    stock: 0,
    minStock: 8,
    status: "out-of-stock",
    createdDate: "2023-11-15"
  },
  {
    id: "PART005",
    name: "Premium Tyres",
    brand: "MRF",
    partNumber: "ZSLK205/55R16",
    category: "Tyres",
    price: "₹6,500",
    stock: 12,
    minStock: 6,
    status: "available",
    createdDate: "2023-12-01"
  }
];

const getStatusBadge = (status: string, stock: number, minStock: number) => {
  if (status === 'out-of-stock' || stock === 0) {
    return <Badge className="bg-destructive-light text-destructive border-destructive/20">
      <AlertTriangle className="w-3 h-3 mr-1" />
      Out of Stock
    </Badge>;
  }
  
  if (status === 'low-stock' || stock <= minStock) {
    return <Badge className="bg-warning-light text-warning border-warning/20">
      <AlertTriangle className="w-3 h-3 mr-1" />
      Low Stock
    </Badge>;
  }
  
  return <Badge className="bg-success-light text-success border-success/20">
    <CheckCircle className="w-3 h-3 mr-1" />
    Available
  </Badge>;
};

const getCategoryBadge = (category: string) => {
  const colors = {
    'Engine': 'bg-blue-100 text-blue-700',
    'Brakes': 'bg-red-100 text-red-700',
    'Electrical': 'bg-yellow-100 text-yellow-700',
    'Tyres': 'bg-purple-100 text-purple-700'
  };
  
  return (
    <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
      {category}
    </Badge>
  );
};

export default function Parts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parts Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage vehicle parts and inventory</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Part
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Parts</p>
                <p className="text-2xl font-bold text-foreground">{filteredParts.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-success">
                  {filteredParts.filter(p => p.stock > p.minStock).length}
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
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">
                  {filteredParts.filter(p => p.stock > 0 && p.stock <= p.minStock).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-destructive">
                  {filteredParts.filter(p => p.stock === 0).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Add New Part</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Part Name" />
              <Input placeholder="Brand" />
              <Input placeholder="Part Number" />
              <Input placeholder="Category" />
              <Input placeholder="Price (₹)" />
              <Input placeholder="Initial Stock" />
              <Input placeholder="Minimum Stock" />
              <div className="md:col-span-2">
                <Textarea placeholder="Part Description" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Add Part</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <Input
            placeholder="Search parts by name, brand, part number, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11"
          />
        </CardContent>
      </Card>

      {/* Parts Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Parts Inventory ({filteredParts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Part Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{part.name}</div>
                      <div className="text-sm text-muted-foreground">{part.partNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(part.category)}</TableCell>
                  <TableCell className="font-medium">{part.brand}</TableCell>
                  <TableCell className="font-semibold">{part.price}</TableCell>
                  <TableCell>
                    <div>
                      <div className={`font-medium ${part.stock <= part.minStock ? 'text-warning' : ''}`}>
                        {part.stock} units
                      </div>
                      <div className="text-xs text-muted-foreground">Min: {part.minStock}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(part.status, part.stock, part.minStock)}</TableCell>
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