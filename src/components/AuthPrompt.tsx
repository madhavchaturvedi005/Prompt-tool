import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AuthPromptProps {
  title?: string;
  description?: string;
  feature?: string;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({ 
  title = "Authentication Required",
  description = "Please sign in to access this feature",
  feature = "challenges"
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-md mx-4 text-center"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-foreground" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-heading font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {description}. Create an account or sign in to unlock {feature} and track your progress.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/signup" className="block">
            <Button className="w-full h-12 gap-2">
              <Sparkles className="w-4 h-4" />
              Create Account
            </Button>
          </Link>
          
          <Link to="/login" className="block">
            <Button variant="outline" className="w-full h-12">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Join thousands of developers improving their prompt engineering skills
          </p>
        </div>
      </motion.div>
    </div>
  );
};