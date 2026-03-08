import type { FeedArticle } from "@/hooks/useArticles";
import { ArticleCard } from "./ArticleCard";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleFeedProps {
  articles: FeedArticle[];
  onRefresh?: () => void;
}

export function ArticleFeed({ articles, onRefresh }: ArticleFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 border border-primary/10">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">
          هنوز مقاله‌ای نیست
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
          اولین نفری باشید که دیدگاه خود را با جامعه به اشتراک می‌گذارد.
        </p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} className="gap-2 rounded-xl">
            <RefreshCw size={16} />
            بارگذاری مجدد
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="py-3 space-y-3 px-3">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className="animate-slide-up"
          style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
        >
          <ArticleCard article={article} onDelete={onRefresh} />
        </div>
      ))}
    </div>
  );
}
