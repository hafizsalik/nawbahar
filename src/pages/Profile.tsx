import { AppLayout } from "@/components/layout/AppLayout";
import { Settings, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center py-12 px-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center mb-4">
          <span className="text-3xl font-serif font-bold text-accent-foreground">F</span>
        </div>
        <h2 className="font-serif text-xl font-semibold mb-2">Welcome to Fetrat</h2>
        <p className="text-muted-foreground text-sm text-center mb-6 max-w-xs">
          Sign in to save articles, follow writers, and join the conversation.
        </p>
        <Link to="/auth">
          <Button className="btn-gold rounded-full px-8">
            <LogIn size={18} className="mr-2" />
            Sign In
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
};

export default Profile;
