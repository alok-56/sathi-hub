import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login Successful",
          description: "Welcome to Vehicle Sathi Admin Panel",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-lg">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Vehicle Sathi</CardTitle>
            <CardDescription className="text-base">Admin Panel Login</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vehiclesathi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary" 
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Secure admin access to Vehicle Sathi platform
          </div>
        </CardContent>
      </Card>
    </div>
  );
}