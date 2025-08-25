import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Save,
  RefreshCw,
  DollarSign,
  Clock,
  MapPin,
  Bell
} from "lucide-react";

const configSections = [
  {
    id: "general",
    title: "General Settings",
    icon: Settings,
    settings: [
      { key: "app_name", label: "App Name", value: "Vehicle Sathi", type: "text" },
      { key: "app_version", label: "App Version", value: "1.2.0", type: "text" },
      { key: "support_email", label: "Support Email", value: "support@vehiclesathi.com", type: "email" },
      { key: "support_phone", label: "Support Phone", value: "+91 80000 12345", type: "tel" }
    ]
  },
  {
    id: "pricing",
    title: "Pricing & Commission",
    icon: DollarSign,
    settings: [
      { key: "platform_commission", label: "Platform Commission (%)", value: "15", type: "number" },
      { key: "min_booking_amount", label: "Minimum Booking Amount (₹)", value: "500", type: "number" },
      { key: "cancellation_fee", label: "Cancellation Fee (₹)", value: "100", type: "number" },
      { key: "gst_percentage", label: "GST Percentage (%)", value: "18", type: "number" }
    ]
  },
  {
    id: "booking",
    title: "Booking Configuration", 
    icon: Clock,
    settings: [
      { key: "advance_booking_days", label: "Advance Booking (Days)", value: "7", type: "number" },
      { key: "cancellation_hours", label: "Cancellation Allowed (Hours)", value: "24", type: "number" },
      { key: "slot_duration", label: "Default Slot Duration (Minutes)", value: "60", type: "number" },
      { key: "buffer_time", label: "Buffer Time Between Slots (Minutes)", value: "15", type: "number" }
    ]
  },
  {
    id: "location",
    title: "Location Settings",
    icon: MapPin,
    settings: [
      { key: "service_radius", label: "Service Radius (KM)", value: "25", type: "number" },
      { key: "default_city", label: "Default City", value: "Mumbai", type: "text" },
      { key: "covered_cities", label: "Covered Cities", value: "Mumbai, Delhi, Bangalore, Pune", type: "textarea" }
    ]
  }
];

const featureTogles = [
  { key: "sos_service", label: "SOS Services", description: "Enable emergency breakdown services", enabled: true },
  { key: "doorstep_service", label: "Doorstep Service", description: "Enable doorstep vehicle services", enabled: true },
  { key: "online_payment", label: "Online Payments", description: "Enable online payment options", enabled: true },
  { key: "cash_payment", label: "Cash Payments", description: "Enable cash payment option", enabled: true },
  { key: "push_notifications", label: "Push Notifications", description: "Send push notifications to users", enabled: true },
  { key: "sms_notifications", label: "SMS Notifications", description: "Send SMS notifications", enabled: false },
  { key: "email_notifications", label: "Email Notifications", description: "Send email notifications", enabled: true },
  { key: "mechanic_verification", label: "Mechanic Verification", description: "Require admin approval for mechanics", enabled: true }
];

export default function AppConfig() {
  const [activeSection, setActiveSection] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const activeConfig = configSections.find(section => section.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">App Configuration</h1>
          <p className="text-muted-foreground mt-1">Configure application settings and features</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Configuration Sections</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {configSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                    activeSection === section.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Configuration Settings */}
          {activeConfig && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <activeConfig.icon className="w-5 h-5" />
                  {activeConfig.title}
                </CardTitle>
                <CardDescription>Configure {activeConfig.title.toLowerCase()} for the application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeConfig.settings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      {setting.type === 'textarea' ? (
                        <Textarea
                          id={setting.key}
                          defaultValue={setting.value}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={setting.key}
                          type={setting.type}
                          defaultValue={setting.value}
                          className="max-w-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Toggles */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Feature Toggles
              </CardTitle>
              <CardDescription>Enable or disable application features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {featureTogles.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={feature.key} className="text-sm font-medium">
                          {feature.label}
                        </Label>
                        <Badge variant={feature.enabled ? "default" : "secondary"}>
                          {feature.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Switch
                      id={feature.key}
                      defaultChecked={feature.enabled}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Database Version</Label>
                  <p className="font-medium">PostgreSQL 14.2</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">API Version</Label>
                  <p className="font-medium">v2.1.0</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">2024-01-15 10:30 AM</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Environment</Label>
                  <Badge className="bg-success-light text-success border-success/20">Production</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}