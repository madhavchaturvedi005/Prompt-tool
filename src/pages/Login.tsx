import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles, ArrowLeft, Zap, Shield, Users, CheckCircle, AlertCircle, Mail, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SupabaseAuthService } from "@/lib/auth";

// Floating animation component
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-foreground/10 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  // Check Supabase connection status
  useEffect(() => {
    const checkSupabaseStatus = () => {
      const isConfigured = isSupabaseConfigured();
      setSupabaseStatus(isConfigured ? 'connected' : 'disconnected');
    };
    
    checkSupabaseStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowEmailVerification(false);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        // Check if it's an email verification issue
        if (isSupabaseConfigured()) {
          try {
            const response = await SupabaseAuthService.login({ email, password });
            if (!response.success && response.requiresConfirmation) {
              setShowEmailVerification(true);
              setError("");
            } else {
              setError(response.error || "Invalid email or password. Please check your credentials and try again.");
            }
          } catch (err) {
            setError("Login failed. Please check your connection and try again.");
          }
        } else {
          setError("Invalid email or password. Please check your credentials and try again.");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setIsResendingEmail(true);
    setResendSuccess(false);

    try {
      const result = await SupabaseAuthService.resendConfirmation(email);
      if (result.success) {
        setResendSuccess(true);
        setError("");
      } else {
        setError(result.error || "Failed to resend confirmation email");
      }
    } catch (err) {
      setError("Failed to resend confirmation email");
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <FloatingElements />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-foreground/5" />
      
      <main className="pt-20 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-foreground/20 via-transparent to-foreground/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1/2 -right-1/2 w-full h-full border border-foreground/10 rounded-full"
                />
              </div>

              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-foreground/20 to-foreground/10 flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
                  />
                  <Sparkles className="w-10 h-10 text-foreground relative z-10" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-heading font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                  Welcome Back
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Continue your prompt engineering journey
                </motion.p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 relative z-10"
                >
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </motion.div>
              )}

              {/* Email Verification Popup */}
              {showEmailVerification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 mb-6 relative z-10"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block mb-4"
                    >
                      <Mail className="w-12 h-12 text-amber-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Email Verification Required
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      Please check your email inbox and click the verification link to activate your account before logging in.
                    </p>
                    
                    {resendSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-400 text-sm">Confirmation email sent successfully!</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setShowEmailVerification(false)}
                          className="h-10 px-4 rounded-lg text-sm"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Login
                        </Button>
                        <Button
                          onClick={handleResendConfirmation}
                          disabled={isResendingEmail}
                          className="h-10 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-sm"
                        >
                          {isResendingEmail ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Resend Email
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-14 px-4 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-14 px-4 pr-14 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground/80 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                      />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.form>

              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/30 relative z-10"
              >
                <div className="text-center">
                  <Shield className="w-5 h-5 text-foreground/60 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Secure</p>
                </div>
                <div className="text-center">
                  <Zap className="w-5 h-5 text-foreground/60 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Fast</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-foreground/60 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Community</p>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-8 pt-6 border-t border-border/30 relative z-10"
              >
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    state={{ from: location.state?.from }}
                    className="text-foreground font-semibold hover:underline transition-all"
                  >
                    Create one now
                  </Link>
                </p>
              </motion.div>
            </motion.div>

            {/* Authentication Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl text-center backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                {supabaseStatus === 'checking' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="w-6 h-6 text-blue-400" />
                  </motion.div>
                ) : supabaseStatus === 'connected' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                )}
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {supabaseStatus === 'checking' && <span className="text-blue-400">Checking connection...</span>}
                    {supabaseStatus === 'connected' && <span className="text-emerald-400">Supabase Connected</span>}
                    {supabaseStatus === 'disconnected' && <span className="text-amber-400">Using Demo Mode</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {supabaseStatus === 'connected' && 'Real authentication active'}
                    {supabaseStatus === 'disconnected' && 'Fallback authentication'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;