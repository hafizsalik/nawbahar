import { Eye, MessageCircle, CornerDownRight, CheckCheck, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardMetricsProps {
  viewCount: number;
  commentCount: number;
  responseCount: number;
  isRead: boolean;
  commentsOpen: boolean;
  tag?: string | null;
  onCommentClick: (e: React.MouseEvent) => void;
  onResponseClick: (e: React.MouseEvent) => void;
}

export function ArticleCardMetrics({
  viewCount,
  commentCount,
  responseCount,
  isRead,
  commentsOpen,
  tag,
  onCommentClick,
  onResponseClick,
}: ArticleCardMetricsProps) {
  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        {/* Left: tag + read indicator */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {tag && (
            <span className="bg-secondary/60 text-muted-foreground/55 px-2.5 py-[3px] rounded-full text-[10px] font-medium whitespace-nowrap">
              {tag}
            </span>
          )}
          {isRead && (
            <CheckCheck size={13} strokeWidth={2.2} className="text-primary/45" />
          )}
        </div>

        {/* Right: icons with generous spacing */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-foreground/40">
            <Eye size={15} strokeWidth={1.7} />
            {viewCount > 0 && <span>{viewCount}</span>}
          </span>

          <button
            onClick={onResponseClick}
            className="flex items-center gap-1 text-[11px] text-foreground/40 hover:text-foreground/65 transition-colors"
          >
            <CornerDownRight size={14} strokeWidth={1.8} />
            {responseCount > 0 && <span>{responseCount}</span>}
          </button>

          <button
            onClick={onCommentClick}
            className={cn(
              "flex items-center gap-1 text-[11px] transition-colors",
              commentsOpen
                ? "text-foreground/65"
                : "text-foreground/40 hover:text-foreground/65"
            )}
          >
            <MessageCircle
              size={15}
              strokeWidth={1.7}
              className={cn(commentsOpen && "fill-primary/20")}
            />
            {commentCount > 0 && <span>{commentCount}</span>}
          </button>

          <button
            onClick={stop}
            className="text-foreground/40 hover:text-foreground/65 transition-colors"
          >
            <ThumbsDown size={14} strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </div>
  );
}