import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { useToast, toast } from "@/hooks/use-toast";
import { serviceService } from "@/services/services";
import { SingleFileUpload, DeleteFileUpload } from "@/services/fileupload";
import { partService } from "@/services/parts";

export default function Parts() {
  const [parts, setParts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [loading, setLoading] = useState({ action: '', id: '', page: false });
  const [formData, setFormData] = useState({ serviceId: '', partname: '', amount: '', image: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  const loadParts = async () => {
    if (!selectedService) return;
    try {
      setLoading(prev => ({ ...prev, page: true }));
      const response = await partService.getParts(selectedService);
      setParts(response.data);
    } catch (error) {
      console.error('Error loading parts:', error);
      toast({
        title: "Error",
        description: "Failed to load parts",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  useEffect(() => {
    if (selectedService) {
      loadParts();
    }
  }, [selectedService]);

  // Fixed: Combined useEffect with proper error handling
  useEffect(() => {
    const initializeData = async () => {
      setLoading(prev => ({ ...prev, page: true }));
      try {
        // Load services only
        const servicesResponse = await serviceService.getServices();
        setServices(servicesResponse.data || []);
        
        // Set default selected service if available
        if (servicesResponse.data?.length > 0) {
          setSelectedService(servicesResponse.data[0]._id);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({ 
          title: "Error", 
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive" 
        });
      } finally {
        setLoading(prev => ({ ...prev, page: false }));
      }
    };

    initializeData();
  }, []); // Single useEffect to avoid race conditions

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({ 
          title: "Error", 
          description: "Please select a valid image file",
          variant: "destructive" 
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ 
          title: "Error", 
          description: "Image size must be less than 5MB",
          variant: "destructive" 
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setPreview(result);
        }
      };
      reader.onerror = () => {
        toast({ 
          title: "Error", 
          description: "Failed to read file",
          variant: "destructive" 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = async () => {
    try {
      if (originalImageUrl) {
        await DeleteFileUpload(originalImageUrl);
      }
    } catch (error) {
      console.error('Failed to delete original image:', error);
      // Don't show error to user as this is a cleanup operation
    } finally {
      setPreview('');
      setSelectedFile(null);
      setFormData(prev => ({ ...prev, image: '' }));
      setOriginalImageUrl('');
    }
  };

  const handleSubmit = async () => {
    // Enhanced validation
    if (!formData.serviceId?.trim()) {
      toast({ 
        title: "Error", 
        description: "Please select a service",
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.partname?.trim()) {
      toast({ 
        title: "Error", 
        description: "Please enter part name",
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({ 
        title: "Error", 
        description: "Please enter a valid amount",
        variant: "destructive" 
      });
      return;
    }

    setLoading({ action: editingPart ? 'update' : 'create', id: editingPart?._id || '', page: false });
    
    try {
      let imageUrl = formData.image;
      
      // Handle image upload
      if (selectedFile) {
        const uploadResponse = await SingleFileUpload(selectedFile);
        if (uploadResponse?.status && uploadResponse?.data) {
          imageUrl = uploadResponse.data;
          
          // Delete old image if updating and there was an original image
          if (editingPart && originalImageUrl && originalImageUrl !== imageUrl) {
            try {
              await DeleteFileUpload(originalImageUrl);
            } catch (error) {
              console.error('Failed to delete old image:', error);
            }
          }
        } else {
          throw new Error('Image upload failed');
        }
      }

      const data = {
        serviceId: formData.serviceId,
        partname: formData.partname.trim(),
        amount: formData.amount,  // Keep as string
        image: imageUrl || '',
        ...(editingPart && { id: editingPart._id })
      };

      let response;
      if (editingPart) {
        response = await partService.updatePart(data);
      } else {
        response = await partService.createPart(data);
      }

      // Update parts list locally for better UX
      if (editingPart) {
        setParts(prev => prev.map(p => 
          p._id === editingPart._id 
            ? { ...p, ...data, _id: editingPart._id }
            : p
        ));
      } else {
        // Add new part to list (assuming API returns the created part)
        if (response?.data) {
          setParts(prev => [...prev, response.data]);
        } else {
          // Fallback: reload all parts
          loadParts();
        }
      }

      resetForm();
      toast({ 
        title: "Success!", 
        description: `Part ${editingPart ? 'updated' : 'created'} successfully`,
        variant: "default"
      });
    } catch (error) {
      console.error('Operation failed:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Operation failed. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setLoading({ action: '', id: '', page: false });
    }
  };

  const handleDelete = async (partId, partName, imageUrl) => {
    if (!partId) {
      toast({ 
        title: "Error", 
        description: "Invalid part ID",
        variant: "destructive" 
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${partName}"?`)) {
      return;
    }

    setLoading({ action: 'delete', id: partId, page: false });
    try {
      await partService.deletePart(partId);
      
      // Delete associated image if it exists
      if (imageUrl) {
        try {
          await DeleteFileUpload(imageUrl);
        } catch (error) {
          console.error('Failed to delete part image:', error);
          // Don't fail the delete operation if image deletion fails
        }
      }
      
      // Update local state
      setParts(prev => prev.filter(p => p._id !== partId));
      toast({ 
        title: "Success", 
        description: `"${partName}" has been deleted`,
        variant: "default"
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete part. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setLoading({ action: '', id: '', page: false });
    }
  };

  const handleEdit = (part) => {
    if (!part?._id) {
      toast({ 
        title: "Error", 
        description: "Invalid part data",
        variant: "destructive" 
      });
      return;
    }

    setEditingPart(part);
    setFormData({ 
      serviceId: part.serviceId || selectedService, 
      partname: part.partname || '', 
      amount: part.amount?.toString() || '', 
      image: part.image || ''
    });
    setPreview(part.image || '');
    setOriginalImageUrl(part.image || '');
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ serviceId: selectedService, partname: '', amount: '', image: '' });
    setSelectedFile(null);
    setPreview('');
    setOriginalImageUrl('');
    setEditingPart(null);
    setShowForm(false);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Helper function to get service name
  const getServiceName = (serviceId) => {
    const service = services.find(s => s._id === serviceId);
    return service ? `${service.servicename} (${service.vehicle_type})` : 'Unknown Service';
  };

  const filteredParts = parts.filter(part => 
    part?.partname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = (action, id) => loading.action === action && (id ? loading.id === id : true);

  return (
    <div className="space-y-6 p-6">
      {loading.page && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Loading...</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parts Inventory</h1>
          <p className="text-gray-600">Manage vehicle parts</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} disabled={loading.page}>
          <Plus className="w-4 h-4 mr-2" />
          Add Part
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPart ? 'Edit Part' : 'Add Part'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service Selection in Form */}
            <div>
              <label className="block text-sm font-medium mb-2">Service *</label>
              <select
                value={formData.serviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading.page}
                required
              >
                <option value="">Select Service...</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.servicename} ({service.vehicle_type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Part Name *</label>
              <Input 
                placeholder="Enter part name" 
                value={formData.partname}
                onChange={(e) => setFormData(prev => ({ ...prev, partname: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount (₹) *</label>
              <Input 
                placeholder="Enter amount" 
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Part Image</label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect}
                key={editingPart?._id || 'new'} // Force re-render to clear file input
              />
              {preview && (
                <div className="mt-2 relative inline-block">
                  <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading('create', undefined) || isLoading('update', undefined) || loading.page}
              >
                {(isLoading('create', undefined) || isLoading('update', undefined)) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingPart ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingPart ? 'Update Part' : 'Add Part'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={isLoading('create', undefined) || isLoading('update', undefined)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div>
            <label className="block text-sm font-medium mb-2">Search Parts</label>
            <Input
              placeholder="Search by part name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Parts ({filteredParts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredParts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No parts found matching your search' : 'No parts found'}
              </p>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(true)}
                  className="mt-4"
                  disabled={loading.page}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Part
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParts.map((part) => (
                <div key={part._id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  {part.image ? (
                    <img 
                      src={part.image} 
                      alt={part.partname} 
                      className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const sibling = target.nextElementSibling as HTMLDivElement;
                          target.style.display = 'none';
                          if (sibling) sibling.style.display = 'flex';
                        }}
                    />
                  ) : null}
                  
                  {/* Fallback icon - shown when no image or image fails to load */}
                  <div 
                    className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"
                    style={{ display: part.image ? 'none' : 'flex' }}
                  >
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{part.partname}</h3>
                    <p className="text-gray-600 font-medium">₹{parseFloat(part.amount || 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 truncate">
                      Service: {getServiceName(part.serviceId)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(part)}
                      disabled={isLoading('edit', part._id) || loading.page}
                      title="Edit part"
                    >
                      {isLoading('edit', part._id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Edit className="w-4 h-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(part._id, part.partname, part.image)}
                      disabled={isLoading('delete', part._id) || loading.page}
                      title="Delete part"
                    >
                      {isLoading('delete', part._id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}