import { Eye, MessageCircle, CornerDownLeft, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleCardMetricsProps {
  viewCount: number;
  commentCount: number;
  responseCount: number;
  isRead: boolean;
  commentsOpen: boolean;
  onCommentClick: (e: React.MouseEvent) => void;
  onResponseClick: (e: React.MouseEvent) => void;
}

const formatCount = (count: number) => new Intl.NumberFormat("fa-AF").format(count);

export function ArticleCardMetrics({
  viewCount,
  commentCount,
  responseCount,
  isRead,
  commentsOpen,
  onCommentClick,
  onResponseClick,
}: ArticleCardMetricsProps) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      <div className="flex items-center justify-center gap-1.5 rounded-full bg-secondary/55 px-2 py-1.5 text-[10.5px] text-muted-foreground/75">
        <Eye size={13} strokeWidth={1.6} />
        <span>{formatCount(viewCount)}</span>
      </div>

      <button
        onClick={onCommentClick}
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-full bg-secondary/55 px-2 py-1.5 text-[10.5px] transition-colors",
          commentsOpen ? "text-primary" : "text-muted-foreground/75 hover:text-primary/80"
        )}
      >
        <MessageCircle size={13} strokeWidth={1.6} />
        <span>{formatCount(commentCount)}</span>
      </button>

      <button
        onClick={onResponseClick}
        className="flex items-center justify-center gap-1.5 rounded-full bg-secondary/55 px-2 py-1.5 text-[10.5px] text-muted-foreground/75 transition-colors hover:text-primary/80"
      >
        <CornerDownLeft size={13} strokeWidth={1.6} />
        <span>{formatCount(responseCount)}</span>
      </button>

      <div
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[10.5px]",
          isRead
            ? "bg-primary/10 text-primary"
            : "bg-secondary/55 text-muted-foreground/75"
        )}
      >
        <CheckCheck size={13} strokeWidth={1.7} />
        <span>{isRead ? "خوانده" : "جدید"}</span>
      </div>
    </div>
  );
}
