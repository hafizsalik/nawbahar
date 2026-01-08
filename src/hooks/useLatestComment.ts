import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LatestComment {
  id: string;
  content: string;
  author_name: string;
}

export function useLatestComment(articleId: string) {
  const [latestComment, setLatestComment] = useState<LatestComment | null>(null);

  useEffect(() => {
    async function fetchLatestComment() {
      const { data: commentData } = await supabase
        .from("comments")
        .select("id, content, user_id")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!commentData) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", commentData.user_id)
        .single();

      setLatestComment({
        id: commentData.id,
        content: commentData.content,
        author_name: profile?.display_name || "کاربر",
      });
    }

    fetchLatestComment();
  }, [articleId]);

  return { latestComment };
}
