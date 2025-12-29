import { AppLayout } from "@/components/layout/AppLayout";
import { TopicTabs } from "@/components/articles/TopicTabs";
import { ArticleFeed } from "@/components/articles/ArticleFeed";
import { mockArticles } from "@/types";

const Index = () => {
  return (
    <AppLayout>
      <TopicTabs />
      <ArticleFeed articles={mockArticles} />
    </AppLayout>
  );
};

export default Index;
