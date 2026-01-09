import { Bookmark, Heart, MessageCircle, Quote, BadgeCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { FeedArticle } from "@/hooks/useArticles";
import { cn } from "@/lib/utils";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";
import { ArticleMenu } from "./ArticleMenu";
import { useUserRole } from "@/hooks/useUserRole";
import { FollowButton } from "@/components/FollowButton";
import { useCitations } from "@/hooks/useCitations";
import { useLatestComment } from "@/hooks/useLatestComment";

interface ArticleCardProps {
  article: FeedArticle;
  onDelete?: () => void;
}

function getReputationRing(score: number): string {
  if (score >= 90) return "ring-2 ring-yellow-500";
  if (score >= 70) return "ring-2 ring-green-500";
  if (score >= 50) return "ring-2 ring-blue-500";
  return "ring-1 ring-border";
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "همین الان";
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
  return `${Math.floor(diffDays / 30)} ماه پیش`;
}

function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} دقیقه`;
}

export function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const navigate = useNavigate();
  const { isAdmin, userId } = useUserRole();
  const {
    isLiked,
    isBookmarked,
    likeCount,
    toggleLike,
    toggleBookmark,
  } = useArticleInteractions(article.id);
  const { citationCount } = useCitations(article.id);
  const { latestComment } = useLatestComment(article.id);
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark();
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${article.author_id}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/article/${article.id}#comments`);
  };

  const reputationScore = article.author?.reputation_score || 0;

  return (
    <article className="bg-card border-b border-border animate-fade-in">
      <Link to={`/article/${article.id}`} className="block">
        {/* Header: Menu Left, Author Right (RTL) */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3" dir="rtl">
          {/* Author - Right side in RTL */}
          <div className="flex items-center gap-2.5">
            <button onClick={handleAuthorClick} className={cn("rounded-full", getReputationRing(reputationScore))}>
              {article.author?.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.display_name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {article.author?.display_name?.charAt(0)}
                  </span>
                </div>
              )}
            </button>
            <div className="flex flex-col items-start">
              <button onClick={handleAuthorClick} className="flex items-center gap-1 hover:underline">
                <span className="text-sm font-medium text-foreground">
                  {article.author?.display_name}
                </span>
                {reputationScore >= 70 && (
                  <BadgeCheck size={14} className={cn(
                    reputationScore >= 90 ? "text-yellow-500" : "text-green-500"
                  )} />
                )}
              </button>
              {article.author?.specialty && (
                <span className="text-xs text-muted-foreground">
                  {article.author.specialty}
                </span>
              )}
            </div>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <FollowButton userId={article.author_id} />
            </div>
          </div>

          {/* Menu - Left side in RTL (appears on left) */}
          <div onClick={(e) => e.preventDefault()}>
            <ArticleMenu
              articleId={article.id}
              authorId={article.author_id}
              currentUserId={userId}
              isAdmin={isAdmin}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Title - Center Aligned */}
        <div className="px-4 pb-3">
          <h3 className="text-lg font-bold text-foreground leading-relaxed line-clamp-2 text-center">
            {article.title}
          </h3>
        </div>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="px-4 pb-3">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Excerpt */}
        <div className="px-4 pb-2">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {article.content.substring(0, 140)}...
          </p>
        </div>

        {/* Tags as hashtags */}
        {article.tags && article.tags.length > 0 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground">
              {article.tags.slice(0, 3).map((tag) => `#${tag}`).join(" ")}
            </p>
          </div>
        )}

        {/* Footer Actions with Metadata */}
        <div className="px-4 pb-3 flex items-center justify-between" dir="rtl">
          {/* Actions - Right side in RTL */}
          <div className="flex items-center gap-5">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 transition-colors"
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                fill={isLiked ? "currentColor" : "none"}
                className={cn(
                  isLiked ? "text-rose-500" : "text-muted-foreground"
                )}
              />
              {likeCount > 0 && (
                <span className="text-xs text-muted-foreground">{likeCount}</span>
              )}
            </button>

            {/* Comment */}
            <button
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle size={20} strokeWidth={1.5} />
            </button>

            {/* Citation/Quote */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Quote size={18} strokeWidth={1.5} />
              {citationCount > 0 && (
                <span className="text-xs">{citationCount}</span>
              )}
            </div>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className="transition-colors"
            >
              <Bookmark
                size={20}
                strokeWidth={1.5}
                fill={isBookmarked ? "currentColor" : "none"}
                className={cn(
                  isBookmarked ? "text-primary" : "text-muted-foreground"
                )}
              />
            </button>
          </div>

          {/* Metadata - Left side in RTL */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{calculateReadTime(article.content)}</span>
            <span>•</span>
            <span>{formatRelativeDate(article.created_at)}</span>
          </div>
        </div>

        {/* Comment Teaser */}
        {latestComment && (
          <div className="px-4 pb-4 pt-2" dir="rtl">
            <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
              <span className="font-medium text-foreground shrink-0">{latestComment.author_name}:</span>
              <span className="text-muted-foreground line-clamp-1 flex-1">{latestComment.content}</span>
            </div>
          </div>
        )}
      </Link>
    </article>
  );
}
