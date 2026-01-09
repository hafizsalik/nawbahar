import { AppLayout } from "@/components/layout/AppLayout";
import { Star, Trophy, Award } from "lucide-react";

const VIP = () => {
  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8 px-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-primary" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">محتوای ویژه</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            مسابقات رسمی، سرمقاله‌های سردبیر و محتوای اختصاصی
          </p>
        </div>

        {/* Competitions Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Trophy size={20} className="text-primary" />
            <span>مسابقات</span>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm">
              به زودی اولین مسابقه نویسندگی نوبهار اعلام می‌شود
            </p>
          </div>
        </div>

        {/* Editorials Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Award size={20} className="text-primary" />
            <span>سرمقاله‌ها</span>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground text-sm">
              سرمقاله‌های منتخب سردبیر به زودی منتشر می‌شوند
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default VIP;
