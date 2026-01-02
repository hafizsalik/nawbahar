import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Send } from "lucide-react";
import { formatSolarShort } from "@/lib/solarHijri";
import type { Comment } from "@/hooks/useComments";

interface CommentSectionProps {
  comments: Comment[];
  loading: boolean;
  submitting: boolean;
  userId: string | null;
  onAddComment: (content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export function CommentSection({
  comments,
  loading,
  submitting,
  userId,
  onAddComment,
  onDeleteComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async () => {
    const success = await onAddComment(newComment);
    if (success) {
      setNewComment("");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">
        نظرات ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="space-y-3">
        <Textarea
          placeholder={userId ? "نظر خود را بنویسید..." : "برای ثبت نظر وارد شوید"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!userId || submitting}
          className="min-h-[100px] resize-none"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!userId || !newComment.trim() || submitting}
            size="sm"
            className="gap-2"
          >
            <Send size={16} />
            {submitting ? "در حال ثبت..." : "ثبت نظر"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          هنوز نظری ثبت نشده است. اولین نفر باشید!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-muted/50 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {comment.author?.avatar_url ? (
                    <img
                      src={comment.author.avatar_url}
                      alt={comment.author.display_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">
                        {comment.author?.display_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {comment.author?.display_name || "کاربر"}
                    </span>
                    <span className="text-xs text-muted-foreground mr-2">
                      {formatSolarShort(comment.created_at)}
                    </span>
                  </div>
                </div>
                {userId === comment.user_id && (
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="حذف نظر"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
