import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/lib/toast";
import { Calculator, Shield, TrendingUp, BarChart3, Sparkles, LogIn, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      showToast.success("Login successful!");
      // Redirect to intended page or default to history
      const from = (location.state as any)?.from?.pathname || "/history";
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden z-0">
      {/* Decorative gradient orbs - hidden on very small screens */}
      <div className="hidden sm:block absolute top-0 left-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-primary/8 dark:bg-primary/12 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="hidden sm:block absolute bottom-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-primary/8 dark:bg-primary/12 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="hidden md:block absolute top-1/2 left-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-chart-1/6 dark:bg-chart-1/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 sm:gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-6 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Forex Helper</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Kelola trading forex Anda dengan mudah dan efisien
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lot Calculator</h3>
                <p className="text-sm text-muted-foreground">
                  Hitung ukuran posisi trading yang tepat berdasarkan risk management
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Trade History & Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Analisis performa trading dengan laporan dan statistik yang detail
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Aman & Terenkripsi</h3>
                <p className="text-sm text-muted-foreground">
                  Data trading Anda terlindungi dengan enkripsi tingkat tinggi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="animate-in fade-in slide-in-from-right duration-700">
          <Card className="w-full shadow-xl border-2">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <div className="md:hidden">
                <CardTitle className="text-3xl font-bold">Forex Helper</CardTitle>
              </div>
              <CardTitle className="text-2xl font-bold hidden md:block">Selamat Datang</CardTitle>
              <CardDescription className="text-base">
                Login untuk mengakses dashboard trading Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
                  disabled={isLoading}
                  size="lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
              
              <Separator />
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Data Anda aman dan terenkripsi</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

