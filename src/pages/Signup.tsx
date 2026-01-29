import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles, ArrowLeft, Rocket, Trophy, Zap, Users, Target, Brain, Mail, LogIn, CheckCircle, AlertCircle, Shield, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SupabaseAuthService } from "@/lib/auth";

// Floating animation component
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          }}
          transition={{
            duration: Math.random() * 15 + 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-1 h-1 bg-foreground/20 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
}

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  // Check Supabase connection status
  useEffect(() => {
    const checkSupabaseStatus = () => {
      const isConfigured = isSupabaseConfigured();
      setSupabaseStatus(isConfigured ? 'connected' : 'disconnected');
    };
    
    checkSupabaseStatus();
  }, []);

  const handleResendConfirmation = async () => {
    setIsResendingEmail(true);
    setResendSuccess(false);

    try {
      const result = await SupabaseAuthService.resendConfirmation(email);
      if (result.success) {
        setResendSuccess(true);
      } else {
        console.error('Failed to resend confirmation:', result.error);
      }
    } catch (err) {
      console.error('Resend confirmation error:', err);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(email, password, name, username);
      if (success) {
        // Always show confirmation message after signup
        setShowConfirmation(true);
      } else {
        setError("Failed to create account. Please check your information and try again.");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("Account creation failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Trophy, text: "Weekly Challenges", color: "text-amber-400" },
    { icon: Brain, text: "AI-Powered Evaluation", color: "text-purple-400" },
    { icon: Target, text: "Skill Tracking", color: "text-emerald-400" },
    { icon: Users, text: "Community Access", color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <FloatingElements />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-foreground/5" />
      
      <main className="pt-20 pb-16 relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 h-full">
          <div className="min-h-[calc(100vh-160px)] flex items-center">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-24 left-4 z-10"
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

            <div className="grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
              {/* Left Side - Benefits (Full Height) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-8 lg:pr-8"
              >
                <div className="space-y-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl lg:text-6xl font-heading font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  >
                    Join the Future of
                    <br />
                    <span className="text-foreground">Prompt Engineering</span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground text-xl leading-relaxed max-w-lg"
                  >
                    Master the art of AI communication with hands-on challenges, real-time feedback, and a community of innovators.
                  </motion.p>
                </div>

                {/* Large Benefits Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="group p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-border/60 transition-all duration-300 hover:scale-105"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-foreground/20 to-foreground/10 flex items-center justify-center mb-4 ${benefit.color} group-hover:scale-110 transition-transform`}>
                        <benefit.icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{benefit.text}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.text === "Weekly Challenges" && "Solve real-world prompt engineering problems"}
                        {benefit.text === "AI-Powered Evaluation" && "Get instant feedback from advanced AI systems"}
                        {benefit.text === "Skill Tracking" && "Monitor your progress and identify areas for improvement"}
                        {benefit.text === "Community Access" && "Connect with developers and share knowledge"}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-3 gap-6 p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-foreground mb-1">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Developers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-foreground mb-1">50K+</div>
                    <div className="text-sm text-muted-foreground">Challenges Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-foreground mb-1">95%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </motion.div>

                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Alex Chen</div>
                      <div className="text-sm text-muted-foreground">Senior AI Engineer</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "PromptLab transformed how I approach AI interactions. The challenges are practical and the feedback is invaluable."
                  </p>
                </motion.div>
              </motion.div>

              {/* Right Side - Signup Form (Full Height) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:pl-8"
              >
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden max-w-md mx-auto lg:max-w-none">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1/2 -left-1/2 w-full h-full border border-foreground/10 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-1/2 -right-1/2 w-full h-full border border-foreground/10 rounded-full"
                    />
                  </div>

                  {/* Header */}
                  <div className="text-center mb-10 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
                      className="w-20 h-20 rounded-3xl bg-gradient-to-br from-foreground/20 to-foreground/10 flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
                      />
                      <Rocket className="w-10 h-10 text-foreground relative z-10" />
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl font-heading font-bold mb-3"
                    >
                      Create Your Account
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-muted-foreground text-lg"
                    >
                      Start your journey in 30 seconds
                    </motion.p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 relative z-10"
                    >
                      <p className="text-red-500 text-sm text-center">{error}</p>
                    </motion.div>
                  )}

                  {/* Form */}
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div>
                      <label className="block text-sm font-medium mb-3 text-foreground">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full h-14 px-4 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm text-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-foreground">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        className="w-full h-14 px-4 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm text-lg"
                        required
                        minLength={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-foreground">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full h-14 px-4 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm text-lg"
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
                          placeholder="Create a password"
                          className="w-full h-14 px-4 pr-14 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm text-lg"
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

                    <div>
                      <label className="block text-sm font-medium mb-3 text-foreground">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full h-14 px-4 pr-14 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all backdrop-blur-sm text-lg"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground/80 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl mt-8"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full mr-3"
                          />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-6 h-6 mr-3" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </motion.form>

                  {/* Email Confirmation Message */}
                  {showConfirmation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-foreground/5 border border-foreground/10 rounded-2xl text-center backdrop-blur-sm"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mb-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto">
                          <Mail className="w-8 h-8 text-background" />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                        Verify Your Email
                      </h3>
                      <p className="text-muted-foreground mb-1 leading-relaxed">
                        We've sent a verification link to
                      </p>
                      <p className="text-foreground font-semibold mb-4 break-words">
                        {email}
                      </p>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        Click the link in your email to activate your account.
                      </p>
                      
                      {resendSuccess && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-foreground/10 border border-foreground/20 rounded-xl p-3 mb-4"
                        >
                          <CheckCircle className="w-5 h-5 text-foreground mx-auto mb-2" />
                          <p className="text-foreground text-sm font-medium">Email sent successfully!</p>
                        </motion.div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => navigate('/login')}
                          className="w-full h-12 rounded-xl bg-foreground hover:bg-foreground/90 text-background"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Go to Login
                        </Button>
                        <Button
                          onClick={handleResendConfirmation}
                          disabled={isResendingEmail}
                          variant="outline"
                          className="w-full h-12 rounded-xl border-foreground/20 hover:bg-foreground/5"
                        >
                          {isResendingEmail ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full mr-2"
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
                    </motion.div>
                  )}

                  {/* Footer */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center mt-8 pt-6 border-t border-border/30 relative z-10"
                  >
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        state={{ from: location.state?.from }}
                        className="text-foreground font-semibold hover:underline transition-all"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>


          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;