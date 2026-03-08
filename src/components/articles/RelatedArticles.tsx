import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatSolarShort } from "@/lib/solarHijri";

interface RelatedArticle {
  id: string;
  title: string;
  cover_image_url: string | null;
  created_at: string;
  author_id: string;
  author?: { display_name: string; avatar_url: string | null };
}

interface RelatedArticlesProps {
  articleId: string;
  tags: string[];
  authorId: string;
}

export function RelatedArticles({ articleId, tags, authorId }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);

  useEffect(() => {
    fetchRelated();
  }, [articleId]);

  const fetchRelated = async () => {
    // Fetch articles by same author or overlapping tags
    const { data } = await supabase
      .from("articles")
      .select("id, title, cover_image_url, created_at, author_id")
      .eq("status", "published")
      .neq("id", articleId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!data || data.length === 0) return;

    // Score by relevance: same author = 3, matching tag = 1 each
    const scored = data.map((a) => {
      let score = 0;
      if (a.author_id === authorId) score += 3;
      return { ...a, score };
    });

    // If we have tags, fetch all articles' tags to compare
    if (tags.length > 0) {
      const ids = data.map((a) => a.id);
      const { data: tagData } = await supabase
        .from("articles")
        .select("id, tags")
        .in("id", ids);

      if (tagData) {
        const tagMap = new Map(tagData.map((t) => [t.id, t.tags || []]));
        scored.forEach((a) => {
          const aTags = tagMap.get(a.id) || [];
          tags.forEach((tag) => {
            if (aTags.includes(tag)) a.score += 1;
          });
        });
      }
    }

    const top = scored
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // If not enough related, fill with recent
    if (top.length < 3) {
      const existing = new Set(top.map((a) => a.id));
      for (const a of scored) {
        if (!existing.has(a.id) && top.length < 4) {
          top.push(a);
          existing.add(a.id);
        }
      }
    }

    // Fetch author profiles
    const authorIds = [...new Set(top.map((a) => a.author_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", authorIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    setArticles(
      top.map((a) => ({
        ...a,
        author: profileMap.get(a.author_id) || undefined,
      }))
    );
  };

  if (articles.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-5">مقالات مرتبط</h3>
      <div className="space-y-4">
        {articles.map((a) => (
          <Link
            key={a.id}
            to={`/article/${a.id}`}
            className="flex gap-3 group"
          >
            {a.cover_image_url && (
              <img
                src={a.cover_image_url}
                alt=""
                className="w-16 h-16 rounded object-cover flex-shrink-0 bg-muted"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-foreground leading-[1.7] line-clamp-2 group-hover:text-primary transition-colors">
                {a.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                {a.author?.avatar_url ? (
                  <img src={a.author.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-[7px] text-muted-foreground">{a.author?.display_name?.charAt(0)}</span>
                  </div>
                )}
                <span className="text-[11px] text-muted-foreground/60">{a.author?.display_name}</span>
                <span className="text-muted-foreground/20 text-[10px]">·</span>
                <span className="text-[10px] text-muted-foreground/40">{formatSolarShort(a.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
