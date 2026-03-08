import { MessageCircle, CheckCheck, CornerUpRight } from "lucide-react";
import { cn, toPersianNumber } from "@/lib/utils";
import { ReactionPicker } from "./ReactionPicker";
import { ReactionDetailsModal } from "./ReactionDetailsModal";
import { REACTION_EMOJIS, type ReactionKey, type ReactionSummary } from "@/hooks/useCardReactions";
import { useState } from "react";

interface ArticleCardMetricsProps {
  articleId: string;
  viewCount: number;
  commentCount: number;
  responseCount: number;
  isRead: boolean;
  commentsOpen: boolean;
  onCommentClick: (e: React.MouseEvent) => void;
  onResponseClick: (e: React.MouseEvent) => void;
  reactionSummary: ReactionSummary;
  onReact: (type: ReactionKey) => void;
}

export function ArticleCardMetrics({
  articleId,
  commentCount,
  responseCount,
  isRead,
  commentsOpen,
  onCommentClick,
  onResponseClick,
  reactionSummary,
  onReact,
}: ArticleCardMetricsProps) {
  const { topTypes, totalCount, reactorNames, userReaction } = reactionSummary;
  const [showReactionDetails, setShowReactionDetails] = useState(false);

  const buildReactorText = () => {
    if (totalCount === 0) return null;
    const names = [...reactorNames];
    if (userReaction) names.unshift("شما");
    const displayNames = names.slice(0, 2);
    const remaining = totalCount - displayNames.length;
    if (displayNames.length === 0 && remaining > 0) return `${toPersianNumber(remaining)} واکنش`;
    let text = displayNames.join(" و ");
    if (remaining > 0) text += ` و ${toPersianNumber(remaining)} نفر دیگر`;
    return text;
  };

  const reactorText = buildReactorText();

  const handleReactionSummaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReactionDetails(true);
  };

  return (
    <>
      <div className="mt-3 pb-4">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onCommentClick}
              className={cn(
                "flex items-center gap-1 text-[12px] transition-colors",
                commentsOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageCircle size={14} strokeWidth={1.5} />
              <span className="text-[11.5px]">
                {commentCount > 0 ? `${toPersianNumber(commentCount)} نظر` : "نظر"}
              </span>
            </button>

            {responseCount > 0 && (
              <button
                onClick={onResponseClick}
                className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <CornerUpRight size={13} strokeWidth={1.5} />
                <span className="text-[11.5px]">{toPersianNumber(responseCount)}</span>
              </button>
            )}

            <ReactionPicker userReaction={userReaction} onReact={onReact} />

            {totalCount > 0 && (
              <button
                onClick={handleReactionSummaryClick}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center -space-x-0.5">
                  {topTypes.slice(0, 2).map((type) => (
                    <span
                      key={type}
                      className="text-[15px] leading-none"
                      role="img"
                      aria-label={type}
                    >
                      {REACTION_EMOJIS[type]}
                    </span>
                  ))}
                </div>
                {reactorText && (
                  <span className="text-[10.5px] text-muted-foreground/50 truncate max-w-[120px] mr-0.5">
                    {reactorText}
                  </span>
                )}
              </button>
            )}

            {isRead && (
              <CheckCheck size={12} strokeWidth={2} className="text-primary/35" />
            )}
          </div>
        </div>
      </div>

      <ReactionDetailsModal
        articleId={articleId}
        isOpen={showReactionDetails}
        onClose={() => setShowReactionDetails(false)}
      />
    </>
  );
}
