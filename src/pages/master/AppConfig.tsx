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

         
          

          
        </div>
      </div>
    </div>
  );
}