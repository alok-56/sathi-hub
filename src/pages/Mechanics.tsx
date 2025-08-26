import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationComponent } from "@/components/PaginationComponent";
import { usePagination } from "@/hooks/usePagination";
import { MechanicDetailsModal } from "@/components/modals/MechanicDetailsModal";
import { 
  Search, 
  Wrench, 
  Eye, 
  Check, 
  X,
  Star,
  MapPin,
  Phone,
  Download,
  Clock,
  Ban,
  Trash2
} from "lucide-react";

const mechanics = [
  {
    id: "MECH001",
    name: "Suresh Patil",
    email: "suresh.patil@email.com",
    phone: "+91 98765 43210",
    location: "Andheri, Mumbai",
    specialization: "Engine Repair, Oil Change",
    experience: "8 years",
    rating: 4.8,
    completedJobs: 342,
    status: "approved",
    joinDate: "2023-06-15",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "MECH002",
    name: "Ramesh Singh",
    email: "ramesh.singh@email.com",
    phone: "+91 87654 32109",
    location: "Sector 18, Noida",
    specialization: "Brake System, AC Repair",
    experience: "5 years",
    rating: 4.6,
    completedJobs: 198,
    status: "approved",
    joinDate: "2023-08-22",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "MECH003",
    name: "Vikash Kumar",
    email: "vikash.kumar@email.com",
    phone: "+91 76543 21098",
    location: "Satellite, Ahmedabad",
    specialization: "Electrical, Battery",
    experience: "6 years",
    rating: 4.7,
    completedJobs: 256,
    status: "pending",
    joinDate: "2024-01-10",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "MECH004",
    name: "Ganesh Rao",
    email: "ganesh.rao@email.com",
    phone: "+91 65432 10987",
    location: "Jubilee Hills, Hyderabad",
    specialization: "Tyre Service, Suspension",
    experience: "12 years",
    rating: 4.9,
    completedJobs: 456,
    status: "approved",
    joinDate: "2023-04-03",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "MECH005",
    name: "Ankit Sharma",
    email: "ankit.sharma@email.com",
    phone: "+91 54321 09876",
    location: "Koramangala, Bangalore",
    specialization: "General Service",
    experience: "3 years",
    rating: 4.2,
    completedJobs: 89,
    status: "rejected",
    joinDate: "2023-12-18",
    avatar: "/api/placeholder/40/40"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-success-light text-success border-success/20">
        <Check className="w-3 h-3 mr-1" />
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

export default function Mechanics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [mechanicsData, setMechanicsData] = useState(mechanics);

  const filteredMechanics = mechanicsData.filter(mechanic => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mechanic.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mechanic.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || mechanic.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage, 
    hasNextPage, 
    hasPreviousPage 
  } = usePagination({
    totalItems: filteredMechanics.length,
    itemsPerPage: 10
  });

  const currentMechanics = filteredMechanics.slice(paginatedData.startIndex, paginatedData.endIndex);

  const handleViewDetails = (mechanic: any) => {
    setSelectedMechanic(mechanic);
    setIsDetailsModalOpen(true);
  };

  const handleBlockMechanic = (mechanicId: string) => {
    setMechanicsData(prev => prev.map(mechanic => 
      mechanic.id === mechanicId ? { ...mechanic, status: 'blocked' } : mechanic
    ));
  };

  const handleDeleteMechanic = (mechanicId: string) => {
    setMechanicsData(prev => prev.filter(mechanic => mechanic.id !== mechanicId));
  };

  const handleApprove = (mechanicId: string) => {
    setMechanicsData(prev => prev.map(mechanic => 
      mechanic.id === mechanicId ? { ...mechanic, status: 'approved' } : mechanic
    ));
  };

  const handleReject = (mechanicId: string) => {
    setMechanicsData(prev => prev.map(mechanic => 
      mechanic.id === mechanicId ? { ...mechanic, status: 'rejected' } : mechanic
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mechanics</h1>
          <p className="text-muted-foreground mt-1">Manage mechanic profiles and approvals</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-hover">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, specialization, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mechanics Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            All Mechanics ({filteredMechanics.length})
          </CardTitle>
          <CardDescription>View and manage mechanic applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Mechanic</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMechanics.map((mechanic) => (
                  <TableRow key={mechanic.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={mechanic.avatar} alt={mechanic.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {mechanic.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{mechanic.name}</div>
                          <div className="text-sm text-muted-foreground">{mechanic.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {mechanic.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {mechanic.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{mechanic.specialization}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{mechanic.experience}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mechanic.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {mechanic.completedJobs}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(mechanic.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(mechanic)} title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {mechanic.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleApprove(mechanic.id)}
                              className="text-success hover:text-success"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleReject(mechanic.id)}
                              className="text-destructive hover:text-destructive"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {mechanic.status === 'approved' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleBlockMechanic(mechanic.id)}
                              className="text-warning hover:text-warning"
                              title="Block"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteMechanic(mechanic.id)}
                              className="text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </CardContent>
      </Card>

      {/* Mechanic Details Modal */}
      <MechanicDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        mechanic={selectedMechanic}
        onBlock={() => selectedMechanic && handleBlockMechanic(selectedMechanic.id)}
        onDelete={() => selectedMechanic && handleDeleteMechanic(selectedMechanic.id)}
      />
    </div>
  );
}