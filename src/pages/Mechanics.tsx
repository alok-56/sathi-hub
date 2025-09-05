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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Trash2,
  Loader2,
} from "lucide-react";
import { mechanicService } from "@/services/mechanics";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approve":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "sendforverification":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Sent for Verification
        </Badge>
      );
    case "resendforverification":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          Resend for Verification
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <X className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "sendforverification", label: "Sent for Verification" },
  { value: "resendforverification", label: "Resend for Verification" },
  { value: "approve", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function Mechanics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMechanics, setTotalMechanics] = useState(0);

  const itemsPerPage = 10;

  // Fetch mechanics data
  const fetchMechanics = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(statusFilter !== "all" && { status: statusFilter }),
      };

      const response = await mechanicService.getMechanics(params);

      if (response.status) {
        setMechanics(response.data || []);
        setTotalPages(response.totalPages || 1);
        setTotalMechanics(response.totalUsers || 0);
      }
    } catch (error) {
      console.error("Failed to fetch mechanics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and filter changes
  useEffect(() => {
    fetchMechanics();
  }, [currentPage, statusFilter]);

  // Filter mechanics based on search term
  const filteredMechanics = mechanics.filter((mechanic) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      mechanic.name?.toLowerCase().includes(searchLower) ||
      mechanic.email?.toLowerCase().includes(searchLower) ||
      mechanic.phone_number?.toString().includes(searchLower) ||
      mechanic.shop_details?.shop_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetails = (mechanic) => {
    setSelectedMechanic(mechanic);
    setIsDetailsModalOpen(true);
  };

  const handleStatusUpdate = async (mechanicId, status, remarks = "") => {
    try {
      const response = await mechanicService.updateMechanicStatus({
        id: mechanicId,
        status,
        remarks,
      });

      if (response.status) {
        // Refresh the data
        fetchMechanics();
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      console.error(`Failed to ${status} mechanic:`, error);
    }
  };

  const handleBlockToggle = async (mechanicId) => {
    try {
      const response = await mechanicService.toggleBlockMechanic(mechanicId);
      if (response.status) {
        fetchMechanics();
        setIsDetailsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to toggle block status:", error);
    }
  };

  const handleDelete = async (mechanicId) => {
    if (window.confirm("Are you sure you want to delete this mechanic?")) {
      try {
        const response = await mechanicService.deleteMechanic(mechanicId);
        if (response.status) {
          fetchMechanics();
          setIsDetailsModalOpen(false);
        }
      } catch (error) {
        console.error("Failed to delete mechanic:", error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mechanics</h1>
          <p className="text-muted-foreground mt-1">
            Manage mechanic profiles and approvals
          </p>
        </div>
        {/* <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button> */}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, phone, or shop name..."
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
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
            All Mechanics ({totalMechanics})
          </CardTitle>
          <CardDescription>
            View and manage mechanic applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Mechanic</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Shop Details</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Vehicle Types</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMechanics.map((mechanic) => (
                      <TableRow
                        key={mechanic._id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={mechanic.documents?.profile_photo}
                                alt={mechanic.name}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                {mechanic.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase() || "M"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{mechanic.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {mechanic._id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              {mechanic.phone_number}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {mechanic.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {mechanic.shop_details?.shop_name || "N/A"}
                            </div>
                            {mechanic.shop_details?.lat &&
                              mechanic.shop_details?.long && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {mechanic.shop_details.lat.toFixed(4)},{" "}
                                  {mechanic.shop_details.long.toFixed(4)}
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mechanic.shop_details?.experience
                              ? `${mechanic.shop_details.experience} years`
                              : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {mechanic.vehicle_type?.map((type, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(mechanic.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(mechanic)}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {(mechanic.status === "pending" ||
                              mechanic.status === "sendforverification" ||
                              mechanic.status === "resendforverification") && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(mechanic._id, "approve")
                                  }
                                  className="text-green-600 hover:text-green-700"
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(mechanic._id, "reject")
                                  }
                                  className="text-red-600 hover:text-red-700"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {mechanic.status === "approve" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleBlockToggle(mechanic._id)
                                  }
                                  className="text-orange-600 hover:text-orange-700"
                                  title={
                                    mechanic.isBlocked ? "Unblock" : "Block"
                                  }
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(mechanic._id)}
                                  className="text-red-600 hover:text-red-700"
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

              {totalPages > 1 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={currentPage < totalPages}
                  hasPreviousPage={currentPage > 1}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Mechanic Details Modal */}
      <MechanicDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        mechanic={selectedMechanic}
        onApprove={(remarks) =>
          selectedMechanic &&
          handleStatusUpdate(selectedMechanic._id, "approve", remarks)
        }
        onReject={(remarks) =>
          selectedMechanic &&
          handleStatusUpdate(selectedMechanic._id, "reject", remarks)
        }
        onBlock={() =>
          selectedMechanic && handleBlockToggle(selectedMechanic._id)
        }
        onDelete={() => selectedMechanic && handleDelete(selectedMechanic._id)}
      />
    </div>
  );
}
