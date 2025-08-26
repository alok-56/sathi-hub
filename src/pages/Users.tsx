import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationComponent } from "@/components/PaginationComponent";
import { usePagination } from "@/hooks/usePagination";
import { CreateUserModal } from "@/components/modals/CreateUserModal";
import { EditUserModal } from "@/components/modals/EditUserModal";
import { 
  Search, 
  Users as UsersIcon, 
  Eye, 
  Ban, 
  Trash2,
  UserCheck,
  UserX,
  Download,
  Phone,
  Mail,
  Plus,
  Edit
} from "lucide-react";

const users = [
  {
    id: "USR001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    joinDate: "2023-12-15",
    bookings: 12,
    totalSpent: "₹18,500",
    status: "active",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "USR002",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 87654 32109",
    location: "Delhi, NCR",
    joinDate: "2023-11-22",
    bookings: 8,
    totalSpent: "₹12,300",
    status: "active",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "USR003",
    name: "Mohammed Ali",
    email: "mohammed.ali@email.com",
    phone: "+91 76543 21098",
    location: "Bangalore, Karnataka",
    joinDate: "2023-10-08",
    bookings: 15,
    totalSpent: "₹25,600",
    status: "blocked",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "USR004",
    name: "Sneha Patel",
    email: "sneha.patel@email.com",
    phone: "+91 65432 10987",
    location: "Ahmedabad, Gujarat",
    joinDate: "2024-01-03",
    bookings: 3,
    totalSpent: "₹4,200",
    status: "active",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "USR005",
    name: "Arjun Reddy",
    email: "arjun.reddy@email.com",
    phone: "+91 54321 09876",
    location: "Hyderabad, Telangana",
    joinDate: "2023-09-18",
    bookings: 20,
    totalSpent: "₹32,800",
    status: "inactive",
    avatar: "/api/placeholder/40/40"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-success-light text-success border-success/20">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>;
    case 'blocked':
      return <Badge className="bg-destructive-light text-destructive border-destructive/20">
        <UserX className="w-3 h-3 mr-1" />
        Blocked
      </Badge>;
    case 'inactive':
      return <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usersData, setUsersData] = useState(users);

  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage, 
    hasNextPage, 
    hasPreviousPage 
  } = usePagination({
    totalItems: filteredUsers.length,
    itemsPerPage: 10
  });

  const currentUsers = filteredUsers.slice(paginatedData.startIndex, paginatedData.endIndex);

  const handleCreateUser = (newUser: any) => {
    setUsersData(prev => [...prev, newUser]);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: any) => {
    setUsersData(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleBlockUser = (userId: string) => {
    setUsersData(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'blocked' ? 'active' : 'blocked' } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsersData(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage customer accounts and profiles</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-primary to-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, email, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            All Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.location}</TableCell>
                    <TableCell className="text-sm">{user.joinDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {user.bookings}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{user.totalSpent}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleBlockUser(user.id)}
                          title={user.status === 'blocked' ? "Unblock User" : "Block User"}
                          className="text-warning hover:text-warning"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

      {/* Modals */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleCreateUser}
      />

      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}