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
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { serviceService } from "@/services/services";
import { DeleteFileUpload, SingleFileUpload } from "@/services/fileupload";

const getStatusBadge = (status) => {
  return status === "active" ? (
    <Badge className="bg-success-light text-success border-success/20">
      Active
    </Badge>
  ) : (
    <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">
      Inactive
    </Badge>
  );
};

const getVehicleTypeBadge = (vehicleType) => {
  const colors = {
    car: "bg-blue-100 text-blue-700",
    bike: "bg-orange-100 text-orange-700",
    auto: "bg-yellow-100 text-yellow-700",
    bus: "bg-purple-100 text-purple-700",
    truck: "bg-red-100 text-red-700",
  };

  return (
    <Badge className={colors[vehicleType] || "bg-gray-100 text-gray-700"}>
      {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
    </Badge>
  );
};

export default function RegularServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    servicename: "",
    image: "",
    vehicle_type: "",
  });

  // Load services on component mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getServices();
      if (response.status) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      if (editingService && editingService.image) {
        await DeleteFileUpload(editingService.image);
      } else if (formData.image) {
        await DeleteFileUpload(formData.image);
      }

      const uploadResponse = await SingleFileUpload(file);

      if (uploadResponse.status && uploadResponse.data) {
        setFormData((prev) => ({ ...prev, image: uploadResponse.data }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.image) {
      try {
        await DeleteFileUpload(formData.image);
        setFormData((prev) => ({ ...prev, image: "" }));
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const handleCreateService = async () => {
    if (!formData.servicename || !formData.vehicle_type) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setCreating(true);
      const response = await serviceService.createService(formData);

      if (response.status) {
        setServices((prev) => [...prev, response.data]);
        setFormData({ servicename: "", image: "", vehicle_type: "" });
        setShowCreateForm(false);
        alert("Service created successfully!");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Error creating service");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !formData.servicename || !formData.vehicle_type) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setCreating(true);
      const response = await serviceService.updateService({
        id: editingService._id,
        ...formData,
      });

      if (response.status) {
        // Update service in list
        setServices((prev) =>
          prev.map((service) =>
            service._id === editingService._id
              ? { ...service, ...formData }
              : service
          )
        );

        // Reset form
        setFormData({ servicename: "", image: "", vehicle_type: "" });
        setEditingService(null);
        setShowCreateForm(false);

        alert("Service updated successfully!");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Error updating service");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      // Find the service to get its image URL
      const serviceToDelete = services.find((s) => s._id === serviceId);

      // Delete the image first if it exists
      if (serviceToDelete && serviceToDelete.image) {
        await DeleteFileUpload(serviceToDelete.image);
      }

      const response = await serviceService.deleteService(serviceId);

      if (response.status) {
        setServices((prev) =>
          prev.filter((service) => service._id !== serviceId)
        );
        alert("Service deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setFormData({
      servicename: service.servicename,
      image: service.image || "",
      vehicle_type: service.vehicle_type,
    });
    setShowCreateForm(true);
  };

  const handleCancelEdit = async () => {
    // If there was a newly uploaded image during editing, delete it
    if (
      formData.image &&
      (!editingService || editingService.image !== formData.image)
    ) {
      try {
        await DeleteFileUpload(formData.image);
      } catch (error) {
        console.error("Error cleaning up image:", error);
      }
    }

    setEditingService(null);
    setFormData({ servicename: "", image: "", vehicle_type: "" });
    setShowCreateForm(false);
  };

  const filteredServices = services.filter(
    (service) =>
      service.servicename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Regular Services
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage regular maintenance services
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>
              {editingService ? "Edit Service" : "Add New Regular Service"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Service Name"
                value={formData.servicename}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    servicename: e.target.value,
                  }))
                }
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.vehicle_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vehicle_type: e.target.value,
                  }))
                }
              >
                <option value="">Select Vehicle Type</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="bus">Bus</option>
                <option value="truck">Truck</option>
              </select>

              {/* Image Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Service Image
                </label>

                {/* Current Image Preview */}
                {formData.image && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={formData.image}
                      alt="Service preview"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingImage}
                      asChild
                    >
                      <span>
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {formData.image ? "Change Image" : "Upload Image"}
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={
                  editingService ? handleUpdateService : handleCreateService
                }
                disabled={creating || uploadingImage}
              >
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingService ? "Update Service" : "Create Service"}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading services...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Service Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Vehicle Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Created Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "No services found matching your search."
                          : "No services available."}
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr
                        key={service._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {service.servicename}
                        </td>
                        <td className="py-3 px-4">
                          {getVehicleTypeBadge(service.vehicle_type)}
                        </td>
                        <td className="py-3 px-4">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.servicename}
                              className="w-12 h-12 object-cover rounded-md"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                              <Upload className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(service.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge("active")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteService(service._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
