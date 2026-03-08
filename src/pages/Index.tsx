import { AppLayout } from "@/components/layout/AppLayout";
import { ArticleFeed } from "@/components/articles/ArticleFeed";
import { usePublishedArticles } from "@/hooks/useArticles";

const Index = () => {
  const { articles, loading, refetch } = usePublishedArticles();

  return (
    <AppLayout>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-primary/15 rounded-2xl" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-primary border-t-transparent rounded-2xl animate-spin" />
            <div className="absolute inset-2 w-8 h-8 border border-accent/30 border-b-transparent rounded-xl animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-sm text-muted-foreground/70 animate-pulse font-medium">در حال بارگذاری...</p>
        </div>
      ) : (
        <ArticleFeed articles={articles} onRefresh={refetch} />
      )}
    </AppLayout>
  );
};

export default Index;
