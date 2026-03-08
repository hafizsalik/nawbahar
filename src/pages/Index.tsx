import { AppLayout } from "@/components/layout/AppLayout";
import { ArticleFeed } from "@/components/articles/ArticleFeed";
import { LoadingScreen } from "@/components/LoadingScreen";
import { usePublishedArticles } from "@/hooks/useArticles";

const Index = () => {
  const { articles, loading, refetch } = usePublishedArticles();

  return (
    <AppLayout>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ArticleFeed articles={articles} onRefresh={refetch} />
      )}
    </AppLayout>
  );
};

export default Index;
