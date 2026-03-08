import { useState } from "react";
import { Eye, MessageCircle, CornerDownLeft, CornerUpRight, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { FeedArticle } from "@/hooks/useArticles";
import { useComments } from "@/hooks/useComments";
import { useResponseArticles } from "@/hooks/useResponseArticles";
import { useLatestComment } from "@/hooks/useLatestComment";
import { ArticleActionsMenu } from "./ArticleActionsMenu";
import { getRelativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";
import { SlideDownComments } from "./SlideDownComments";

interface ArticleCardProps {
  article: FeedArticle;
  onDelete?: () => void;
}

function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} دقیقه`;
}

function getExcerpt(content: string, maxChars: number = 140): string {
  if (content.length <= maxChars) return content;
  return content.slice(0, maxChars).trim() + "...";
}

export function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const navigate = useNavigate();
  const { comments, loading: commentsLoading, userId, addComment, deleteComment, refetch: refetchComments, submitting } = useComments(article.id);
  const { responseCount, parentArticle } = useResponseArticles(article.id);
  const { latestComment } = useLatestComment(article.id);
  const [showComments, setShowComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const viewCount = (article as any).view_count || 0;

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${article.author_id}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleResponseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/write?response_to=${article.id}`);
  };

  const formatCount = (count: number) => count > 0 ? count : null;

  return (
    <article className="bg-card rounded-2xl border border-border/60 overflow-hidden card-elevated accent-bar">
      {/* Response indicator */}
      {parentArticle && (
        <Link 
          to={`/article/${parentArticle.id}`}
          className="flex items-center gap-1.5 px-5 pt-3 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          <CornerUpRight size={12} strokeWidth={1.5} />
          <span>پاسخ به: {parentArticle.title.slice(0, 40)}{parentArticle.title.length > 40 ? '...' : ''}</span>
        </Link>
      )}

      {/* Main Content Area */}
      <Link to={`/article/${article.id}`} className="block">
        {/* Author Row */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleAuthorClick} 
              className="flex items-center gap-2.5 group"
              aria-label={`پروفایل ${article.author?.display_name}`}
            >
              {article.author?.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-background shadow-sm group-hover:ring-primary/20 transition-all"
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center ring-2 ring-background shadow-sm group-hover:bg-primary/15 transition-colors">
                  <span className="text-primary text-xs font-bold">
                    {article.author?.display_name?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[13px] text-foreground group-hover:text-primary transition-colors font-semibold leading-tight">
                  {article.author?.display_name}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {getRelativeTime(article.created_at)}
                </span>
              </div>
            </button>
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <ArticleActionsMenu
              articleId={article.id}
              authorId={article.author_id}
              articleTitle={article.title}
            />
          </div>
        </div>

        {/* Title - centered, prominent */}
        <div className="px-5 pb-2">
          <h3 className="text-[15px] font-bold text-foreground leading-8 line-clamp-2 text-center">
            {article.title}
          </h3>
        </div>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="px-5 pb-3">
            <div className="aspect-[2.2/1] overflow-hidden bg-muted/50 rounded-xl relative">
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton" />
              )}
              <img
                src={article.cover_image_url}
                alt=""
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        )}

        {/* Excerpt */}
        <div className="px-5 pb-3">
          <p className="text-[13px] text-muted-foreground leading-7 line-clamp-2">
            {getExcerpt(article.content, 140)}
          </p>
        </div>
      </Link>

      {/* Bottom Interaction Bar */}
      <div className="border-t border-border/40 px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Read time pill */}
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
            <Clock size={10} strokeWidth={2} />
            {calculateReadTime(article.content)}
          </span>
          
          <div className="flex items-center gap-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors rounded-md px-1.5 py-1 hover:bg-muted/50">
            <Eye size={13} strokeWidth={1.5} />
            {formatCount(viewCount) && (
              <span className="text-[10px]">{viewCount}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={handleCommentClick}
            className={cn(
              "flex items-center gap-1 transition-all duration-200 rounded-md px-2 py-1",
              showComments 
                ? "text-primary bg-primary/8" 
                : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
            )}
            aria-label={`${comments.length} نظر`}
          >
            <MessageCircle size={13} strokeWidth={1.5} />
            {formatCount(comments.length) && (
              <span className="text-[10px] font-medium">{comments.length}</span>
            )}
          </button>
          
          <button 
            onClick={handleResponseClick}
            className="flex items-center gap-1 text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50 transition-all duration-200 rounded-md px-2 py-1"
            aria-label={`${responseCount} پاسخ`}
          >
            <CornerDownLeft size={13} strokeWidth={1.5} />
            {formatCount(responseCount) && (
              <span className="text-[10px] font-medium">{responseCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Latest Comment Teaser - abstracted, outside main card feel */}
      {latestComment && !showComments && (
        <div 
          className="bg-muted/40 border-t border-border/30 px-5 py-2.5 cursor-pointer hover:bg-muted/60 transition-colors"
          onClick={handleCommentClick}
        >
          <p className="text-[12px] text-muted-foreground leading-5 line-clamp-1">
            <span className="font-semibold text-foreground/70">{latestComment.author_name}</span>
            <span className="mx-1.5 text-border">|</span>
            <span className="text-muted-foreground/80">{latestComment.content}</span>
          </p>
        </div>
      )}

      {/* Slide-down Comments */}
      {showComments && (
        <div className="border-t border-border/30">
          <SlideDownComments
            isOpen={showComments}
            articleId={article.id}
            comments={comments}
            loading={commentsLoading}
            submitting={submitting}
            userId={userId}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            onClose={() => setShowComments(false)}
            refetch={refetchComments}
          />
        </div>
      )}
    </article>
  );
}
