import { AppLayout } from "@/components/layout/AppLayout";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const Explore = () => {
  const trendingTopics = ["Afghan Literature", "Economics", "Health Research", "Traditional Arts", "Technology"];

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Search articles, topics, writers..." 
            className="pl-10 bg-muted border-0 rounded-xl h-12"
          />
        </div>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-accent" />
            <h2 className="font-serif text-lg font-semibold">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button key={topic} className="tag-pill hover:bg-accent hover:text-accent-foreground transition-colors">
                {topic}
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Explore;
