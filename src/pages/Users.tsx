import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationComponent } from "@/components/PaginationComponent";

import { User } from "@/types/api";
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
  Wallet,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/users";
import { ViewUserModal } from "@/components/modals/UserDetailsModal";

const getStatusBadge = (isBlocked: boolean, status?: string) => {
  if (isBlocked) {
    return (
      <Badge className="bg-destructive-light text-destructive border-destructive/20">
        <UserX className="w-3 h-3 mr-1" />
        Blocked
      </Badge>
    );
  }

  return (
    <Badge className="bg-success-light text-success border-success/20">
      <UserCheck className="w-3 h-3 mr-1" />
      Active
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPayLoyaltyModalOpen, setIsPayLoyaltyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Load users from API
  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await userService.getUsers({
        page,
        limit: itemsPerPage,
      });

      if (response.status) {
        setUsersData(response.data);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setTotalUsers(response.totalUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users locally (since API doesn't seem to have search endpoint)
  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handlePayLoyalty = (user: User) => {
    setSelectedUser(user);
    setIsPayLoyaltyModalOpen(true);
  };

  const handleBlockUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await userService.toggleBlockUser(userId);

      if (response.status) {
        setUsersData((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );

        const user = usersData.find((u) => u._id === userId);
        const action = user?.isBlocked ? "unblocked" : "blocked";
        toast.success(`User ${action} successfully`);
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await userService.deleteUser(userId);

      if (response.status) {
        // Remove from local state
        setUsersData((prev) => prev.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");

        // If current page becomes empty, go to previous page
        if (filteredUsers.length === 1 && currentPage > 1) {
          loadUsers(currentPage - 1);
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (page: number) => {
    loadUsers(page);
  };

  const handleExportUsers = () => {
    // Create CSV content
    const csvHeaders = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Vehicle Types",
      "Wallet Amount",
      "Status",
      "Join Date",
    ];
    const csvRows = usersData.map((user) => [
      user._id,
      user.name,
      user.email,
      user.phone_number,
      user.vehicle_type.join("; "),
      user.wallet_amount,
      user.isBlocked ? "Blocked" : "Active",
      formatDate(user.createdAt),
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Users exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer accounts and profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportUsers}>
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
            All Users ({searchTerm ? filteredUsers.length : totalUsers})
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
                  <TableHead>Vehicle Types</TableHead>
                  <TableHead>Wallet</TableHead>

                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(searchTerm ? filteredUsers : usersData).map((user) => (
                  <TableRow key={user._id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user._id}
                          </div>
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
                          {user.phone_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.vehicle_type.map((vehicle, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {formatCurrency(user.wallet_amount)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(user.isBlocked)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePayLoyalty(user)}
                          title="Pay Loyalty Amount"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Wallet className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBlockUser(user._id)}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                          className="text-warning hover:text-warning"
                          disabled={actionLoading === user._id}
                        >
                          {actionLoading === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete User"
                          className="text-destructive hover:text-destructive"
                          disabled={actionLoading === user._id}
                        >
                          {actionLoading === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Show pagination only when not searching */}
          {!searchTerm && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={currentPage < totalPages}
              hasPreviousPage={currentPage > 1}
            />
          )}

          {/* Show message when search has no results */}
          {searchTerm && filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching "{searchTerm}"
            </div>
          )}

          {/* Show message when no users exist */}
          {!searchTerm && usersData.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No users found. Create your first user to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewUserModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        user={selectedUser}
      />

      {/* <PayLoyaltyModal
        open={isPayLoyaltyModalOpen}
        onOpenChange={setIsPayLoyaltyModalOpen}
        user={selectedUser}
        onSuccess={() => loadUsers(currentPage)}
      /> */}
    </div>
  );
}
