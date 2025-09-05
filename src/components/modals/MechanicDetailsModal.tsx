import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Calendar, 
  Wrench, 
  Clock,
  CheckCircle,
  X,
  Ban,
  Trash2,
  Check
} from "lucide-react";

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    secondary: "bg-gray-100 text-gray-700 border-gray-200",
    outline: "bg-transparent border-2 border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, className = "", variant = "default", size = "default", disabled = false, title }) => {
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700"
  };
  
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'approve':
      return <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>;
    case 'sendforverification':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Clock className="w-3 h-3 mr-1" />
        Sent for Verification
      </Badge>;
    case 'resendforverification':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        <Clock className="w-3 h-3 mr-1" />
        Resend for Verification
      </Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 border-red-200">
        <X className="w-3 h-3 mr-1" />
        Rejected
      </Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function MechanicDetailsModal({ 
  open, 
  onOpenChange, 
  mechanic, 
  onApprove, 
  onReject, 
  onBlock, 
  onDelete 
}) {
  const [remarks, setRemarks] = useState("");
  const [showRemarks, setShowRemarks] = useState(false);
  const [actionType, setActionType] = useState("");

  if (!open || !mechanic) return null;

  const handleAction = (type) => {
    if (type === 'approve' || type === 'reject') {
      setActionType(type);
      setShowRemarks(true);
    } else {
      if (type === 'block') onBlock();
      if (type === 'delete') onDelete();
    }
  };

  const submitWithRemarks = () => {
    if (actionType === 'approve') {
      onApprove(remarks);
    } else if (actionType === 'reject') {
      onReject(remarks);
    }
    setRemarks("");
    setShowRemarks(false);
    setActionType("");
  };

  const resetRemarks = () => {
    setShowRemarks(false);
    setActionType("");
    setRemarks("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Mechanic Details</h2>
              <p className="text-sm text-gray-500">Mechanic ID: {mechanic._id}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(mechanic.status)}
              <Button onClick={() => onOpenChange(false)} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!showRemarks ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                    {mechanic.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xl font-semibold">{mechanic.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {mechanic.phone_number}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {mechanic.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {mechanic.shop_details?.lat && mechanic.shop_details?.long 
                        ? `${mechanic.shop_details.lat.toFixed(4)}, ${mechanic.shop_details.long.toFixed(4)}`
                        : 'Location not available'
                      }
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Shop Name</p>
                    <p className="font-medium">{mechanic.shop_details?.shop_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Charge</p>
                    <p className="font-medium">{mechanic.shop_details?.perHourPrice || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{mechanic.shop_details?.experience ? `${mechanic.shop_details.experience} years` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mechanic.vehicle_type?.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <Badge className={mechanic.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {mechanic.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{mechanic.shop_details?.description || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{new Date(mechanic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Referral Code</p>
                    <p className="font-medium">{mechanic.referral_code}</p>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              {/* Verification Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Verification Status</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Email Verified</p>
                    <Badge className={mechanic.isemailverified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {mechanic.isemailverified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Verified</p>
                    <Badge className={mechanic.isPhoneverified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {mechanic.isPhoneverified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <Badge className={mechanic.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {mechanic.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              {/* Payment Details */}
              {mechanic.payment_details && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Account Holder</p>
                        <p className="font-medium">{mechanic.payment_details.account_holder_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium">{mechanic.payment_details.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium">{mechanic.payment_details.account_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">IFSC Code</p>
                        <p className="font-medium">{mechanic.payment_details.ifsc_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">UPI ID</p>
                        <p className="font-medium">{mechanic.payment_details.upi_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Preferred Method</p>
                        <p className="font-medium">{mechanic.payment_details.preferred_method}</p>
                      </div>
                    </div>
                  </div>
                  <hr className="my-6" />
                </>
              )}

              {/* Documents */}
              {mechanic.documents && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Documents</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {mechanic.documents.profile_photo && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Profile Photo</p>
                        <img 
                          src={mechanic.documents.profile_photo} 
                          alt="Profile" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    {mechanic.documents.adhar_card && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Aadhaar Card</p>
                        <img 
                          src={mechanic.documents.adhar_card} 
                          alt="Aadhaar" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    {mechanic.documents.shop_photo && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Shop Photo</p>
                        <img 
                          src={mechanic.documents.shop_photo} 
                          alt="Shop" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {(mechanic.status === 'pending' || mechanic.status === 'sendforverification' || mechanic.status === 'resendforverification') && (
                  <>
                    <Button 
                      onClick={() => handleAction('approve')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleAction('reject')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {mechanic.status === 'approve' && (
                  <>
                    <Button 
                      onClick={() => handleAction('block')}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      {mechanic.isBlocked ? "Unblock" : "Block"}
                    </Button>
                    <Button 
                      onClick={() => handleAction('delete')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {actionType === 'approve' ? 'Approve Mechanic' : 'Reject Mechanic'}
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks {actionType === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={`Enter remarks for ${actionType}...`}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required={actionType === 'reject'}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  onClick={resetRemarks}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitWithRemarks}
                  disabled={actionType === 'reject' && !remarks.trim()}
                  className={actionType === 'approve' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}