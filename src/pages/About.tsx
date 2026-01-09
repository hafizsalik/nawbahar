import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight size={20} />
          <span>بازگشت</span>
        </button>

        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-black text-foreground mb-2">نوبهار</h1>
          <p className="text-muted-foreground">پلتفرم نویسندگی فارسی</p>
        </div>

        {/* About Content */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold">درباره ما</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            نوبهار یک پلتفرم نویسندگی و اشتراک‌گذاری مقاله به زبان فارسی است.
            ما به نویسندگان و اندیشمندان کمک می‌کنیم تا صدای خود را به گوش دیگران برسانند.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            هدف ما ایجاد فضایی امن و علمی برای تبادل ایده‌ها و دانش است.
          </p>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-muted-foreground">
          نسخه ۱.۰.۰ بتا
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
