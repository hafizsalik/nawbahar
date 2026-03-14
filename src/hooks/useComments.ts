import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validation } from "@/lib/errorHandler";
import { playSubmitSound } from "@/lib/sounds";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id?: string | null;
  image_url?: string | null;
  author?: {
    display_name: string;
    avatar_url: string | null;
  };
}

interface UseCommentsOptions {
  lazy?: boolean;
}

export function useComments(articleId: string, options?: UseCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const lazy = options?.lazy ?? false;

  useEffect(() => {
    checkAuth();
    if (!lazy) {
      fetchComments();
    } else {
      setLoading(false);
    }

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`comments-${articleId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "comments",
        filter: `article_id=eq.${articleId}`,
      }, (payload) => {
        if (payload.eventType === "INSERT") {
          const newComment = payload.new as any;
          setComments(prev => {
            const exists = prev.some(c => c.id === newComment.id);
            if (exists) return prev;
            return [...prev, {
              id: newComment.id,
              content: newComment.content,
              created_at: newComment.created_at,
              user_id: newComment.user_id,
              parent_id: newComment.parent_id,
              image_url: newComment.image_url,
              like_count: newComment.like_count ?? 0,
              author: undefined,
            }];
          });
        } else if (payload.eventType === "DELETE") {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId, lazy]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUserId(session?.user?.id || null);
  };

  const fetchComments = async () => {
    setLoading(true);
    
    const { data: commentsData, error } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id, parent_id, image_url, like_count")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });

    if (error || !commentsData) {
      setLoading(false);
      return;
    }

    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const profilesMap = new Map(
      (profilesData || []).map(p => [p.id, p])
    );

    const transformed: Comment[] = commentsData.map((item) => {
      const profile = profilesMap.get(item.user_id);
      return {
        id: item.id,
        content: item.content,
        created_at: item.created_at,
        user_id: item.user_id,
        parent_id: item.parent_id,
        image_url: item.image_url || null,
        like_count: item.like_count ?? 0,
        author: profile ? {
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        } : undefined,
      };
    });
    
    setComments(transformed);
    setLoading(false);
  };

  const addComment = async (content: string, parentId?: string, imageUrl?: string) => {
    if (!userId) {
      toast({
        title: "نیاز به ورود",
        description: "برای ثبت نظر باید وارد شوید",
        variant: "destructive",
      });
      return false;
    }

    const commentError = validation.comment.validate(content);
    if (commentError) {
      toast({
        title: "خطا",
        description: commentError,
        variant: "destructive",
      });
      return false;
    }

    setSubmitting(true);

    const insertData: any = {
      article_id: articleId,
      user_id: userId,
      content: content.trim(),
      parent_id: parentId || null,
    };
    if (imageUrl) insertData.image_url = imageUrl;

    const { error } = await supabase.from("comments").insert(insertData);

    if (error) {
      toast({
        title: "خطا",
        description: "مشکلی در ثبت نظر پیش آمد",
        variant: "destructive",
      });
      setSubmitting(false);
      return false;
    }

    toast({ title: parentId ? "پاسخ ثبت شد" : "نظر شما ثبت شد" });
    import("@/lib/sounds").then(m => m.playSubmitSound());
    await fetchComments();
    setSubmitting(false);
    return true;
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId);

    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));
      toast({ title: "نظر حذف شد" });
    }
  };

  return {
    comments,
    loading,
    submitting,
    userId,
    addComment,
    deleteComment,
    refetch: fetchComments,
  };
}
