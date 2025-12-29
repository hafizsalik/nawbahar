import { AppLayout } from "@/components/layout/AppLayout";
import { Bookmark } from "lucide-react";

const Bookmarks = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Bookmark size={28} className="text-muted-foreground" />
        </div>
        <h2 className="font-serif text-xl font-semibold mb-2">Your Saved Articles</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Articles you save will appear here for offline reading.
        </p>
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
