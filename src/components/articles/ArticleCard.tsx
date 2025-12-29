import { Bookmark, Heart, MessageCircle, Share2, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Article } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(article.is_bookmarked || false);
  const [isLiked, setIsLiked] = useState(article.is_liked || false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  };

  const formatReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (variant === "featured") {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <article className="relative overflow-hidden rounded-2xl animate-fade-in">
          {article.cover_image_url && (
            <div className="aspect-[16/10] overflow-hidden">
              <img 
                src={article.cover_image_url} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <h2 className="font-serif text-xl font-semibold text-primary-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            
            <div className="flex items-center gap-3">
              {article.author?.avatar_url && (
                <img 
                  src={article.author.avatar_url} 
                  alt={article.author.display_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/30"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-primary-foreground/90">
                    {article.author?.display_name}
                  </span>
                  <BadgeCheck size={14} className="text-accent" />
                </div>
                <span className="text-xs text-primary-foreground/60">
                  {article.author?.specialty}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article className="bg-card rounded-xl p-4 border border-border/50 animate-fade-in hover:shadow-md transition-all duration-300">
      <Link to={`/article/${article.id}`} className="block group">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            {/* Author info */}
            <div className="flex items-center gap-2 mb-2">
              {article.author?.avatar_url && (
                <img 
                  src={article.author.avatar_url} 
                  alt={article.author.display_name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-foreground truncate">
                {article.author?.display_name}
              </span>
              <BadgeCheck size={14} className="text-accent flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                · {formatDate(article.created_at)}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="font-serif text-lg font-medium text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag-pill text-xs py-0.5">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatReadTime(article.content)}</span>
              <span>·</span>
              <span>{article.read_count.toLocaleString()} reads</span>
            </div>
          </div>
          
          {/* Thumbnail */}
          {article.cover_image_url && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
              <img 
                src={article.cover_image_url} 
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
        </div>
      </Link>
      
      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              isLiked ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span>{article.save_count + (isLiked ? 1 : 0)}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle size={18} />
            <span>12</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsBookmarked(!isBookmarked);
            }}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              isBookmarked ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          
          <button className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
