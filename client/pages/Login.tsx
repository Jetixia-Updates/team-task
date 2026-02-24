import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Zap, Users, BarChart3, Shield } from "lucide-react";

interface LoginCredentials {
  email: string;
  password: string;
  role: "employee" | "admin";
}

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate authentication
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store user session
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        role: credentials.role,
        name: credentials.email.split("@")[0],
      };

      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (credentials.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "employee") => {
    setCredentials((prev) => ({ ...prev, role }));
    setCredentials({
      email: role === "admin" ? "admin@company.com" : "employee@company.com",
      password: "demo123",
      role,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Brand & Features */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="inline-flex items-center space-x-3 mb-6">
              <img
                src="/Adsolution logotrans.png"
                alt="Adsolution"
                className="h-12 w-auto object-contain"
              />
              <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Manage Your Team Effortlessly
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A modern task management system designed for teams. Distribute work, track progress, and boost productivity.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Users,
                title: "Team Management",
                description: "Organize employees and assign roles",
              },
              {
                icon: Zap,
                title: "Smart Task Distribution",
                description: "Assign tasks with deadlines and priorities",
              },
              {
                icon: BarChart3,
                title: "Performance Tracking",
                description: "Monitor progress and generate reports",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security for your data",
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border space-y-3">
            <p className="text-sm text-muted-foreground">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin("admin")}
                className="text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium py-2 px-3 rounded-lg transition-colors border border-secondary/20"
              >
                Admin Demo
              </button>
              <button
                onClick={() => handleDemoLogin("employee")}
                className="text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 px-3 rounded-lg transition-colors border border-primary/20"
              >
                Employee Demo
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to your account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="h-10 border-border bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="h-10 border-border bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Login As</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCredentials((prev) => ({
                          ...prev,
                          role: "employee",
                        }))
                      }
                      className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        credentials.role === "employee"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-white text-foreground hover:border-primary/30"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCredentials((prev) => ({
                          ...prev,
                          role: "admin",
                        }))
                      }
                      className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        credentials.role === "admin"
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border bg-white text-foreground hover:border-secondary/30"
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg font-semibold text-white border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Demo credentials are pre-filled above ↑
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
