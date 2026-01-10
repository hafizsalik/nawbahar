import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Send, ImagePlus, X, Tag, Quote, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArticleSearch } from "@/hooks/useCitations";
import { compressArticleImage } from "@/lib/imageCompression";
import type { User } from "@supabase/supabase-js";

const categories = [
  { id: "politics", label: "سیاست", icon: "🏛️" },
  { id: "culture", label: "فرهنگ", icon: "🎭" },
  { id: "science", label: "علم", icon: "🔬" },
  { id: "society", label: "جامعه", icon: "👥" },
  { id: "economy", label: "اقتصاد", icon: "📊" },
  { id: "health", label: "سلامت", icon: "🏥" },
  { id: "other", label: "سایر", icon: "✏️" },
];

const DRAFT_KEY = "nobahar_draft";

interface SelectedCitation {
  id: string;
  title: string;
}

const ArticleEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Citation state
  const [citationSearch, setCitationSearch] = useState("");
  const [selectedCitations, setSelectedCitations] = useState<SelectedCitation[]>([]);
  const [showCitationResults, setShowCitationResults] = useState(false);
  const { results: citationResults, searching, searchArticles } = useArticleSearch();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.title) setTitle(draft.title);
        if (draft.content) setContent(draft.content);
        if (draft.category) setCategory(draft.category);
        if (draft.customCategory) setCustomCategory(draft.customCategory);
        if (draft.tagsInput) setTagsInput(draft.tagsInput);
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const draft = { title, content, category, customCategory, tagsInput };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, content, category, customCategory, tagsInput]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Debounced citation search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (citationSearch.trim().length >= 2) {
        searchArticles(citationSearch);
        setShowCitationResults(true);
      } else {
        setShowCitationResults(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [citationSearch]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً عنوان و متن مقاله را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      let coverImageUrl = null;
      
      // Upload cover image if exists
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('article-covers')
          .upload(fileName, coverImage);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('article-covers')
          .getPublicUrl(fileName);
        
        coverImageUrl = urlData.publicUrl;
      }

      // Parse tags from input
      const parsedTags = tagsInput
        .split(/[,،\s]+/)
        .map(tag => tag.trim().replace(/^#/, ''))
        .filter(tag => tag.length > 0);
      
      // Add category as the first tag if selected
      const finalCategory = category === "other" ? customCategory : category;
      const allTags = finalCategory ? [finalCategory, ...parsedTags] : parsedTags;

      // Insert article with PUBLISHED status (instant publish)
      const { data: articleData, error } = await supabase.from("articles").insert({
        title: title.trim(),
        content: content.trim(),
        author_id: user.id,
        status: "published",
        cover_image_url: coverImageUrl,
        tags: allTags,
      }).select("id").single();

      if (error) throw error;

      // Insert citations if any
      if (selectedCitations.length > 0 && articleData?.id) {
        const citationInserts = selectedCitations.map(citation => ({
          source_article_id: articleData.id,
          cited_article_id: citation.id,
        }));

        await supabase.from("citations").insert(citationInserts);
      }

      // Clear draft on successful publish
      localStorage.removeItem(DRAFT_KEY);

      toast({
        title: "موفق!",
        description: "مقاله شما با موفقیت منتشر شد",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "مشکلی در ثبت مقاله پیش آمد",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast({
        title: "در حال فشرده‌سازی...",
        description: "تصویر در حال بهینه‌سازی است",
      });

      const compressedFile = await compressArticleImage(file);
      
      setCoverImage(compressedFile);
      setCoverPreview(URL.createObjectURL(compressedFile));
      
      toast({
        title: "موفق",
        description: `تصویر بهینه شد: ${Math.round(compressedFile.size / 1024)} کیلوبایت`,
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در پردازش تصویر پیش آمد",
        variant: "destructive",
      });
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addCitation = (article: { id: string; title: string }) => {
    if (!selectedCitations.find(c => c.id === article.id)) {
      setSelectedCitations([...selectedCitations, article]);
    }
    setCitationSearch("");
    setShowCitationResults(false);
  };

  const removeCitation = (id: string) => {
    setSelectedCitations(selectedCitations.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14 max-w-screen-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight size={24} />
          </button>
          <h1 className="text-lg font-semibold">نوشتن مقاله</h1>
          <Button
            onClick={handlePublish}
            disabled={loading || !title.trim() || !content.trim()}
            size="sm"
            className="gap-2"
          >
            <Send size={16} />
            {loading ? "در حال ثبت..." : "انتشار"}
          </Button>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-screen-md mx-auto p-4 pb-20">
        <div className="space-y-4">
          {/* Cover Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          {coverPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={coverPreview} alt="Cover" className="w-full h-48 object-cover" />
              <button
                onClick={removeCoverImage}
                className="absolute top-2 left-2 p-1.5 bg-background/80 rounded-full hover:bg-background"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ImagePlus size={28} />
              <span className="text-sm">افزودن تصویر کاور</span>
            </button>
          )}
          
          <Input
            placeholder="عنوان مقاله..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 bg-transparent"
          />

          {/* Category & Tags */}
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 relative">
                <Tag size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="برچسب‌ها (با کاما جدا کنید)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Custom Category Input */}
            {category === "other" && (
              <Input
                placeholder="نام دسته‌بندی خود را بنویسید..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </div>

          {/* Citation Search */}
          <div className="relative">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Quote size={16} />
              <span>ارجاع به مقالات دیگر</span>
            </div>
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجوی مقاله برای ارجاع..."
                value={citationSearch}
                onChange={(e) => setCitationSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            
            {/* Citation Search Results */}
            {showCitationResults && citationResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {citationResults.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => addCitation(article)}
                    className="w-full text-right px-4 py-2 hover:bg-muted transition-colors text-sm"
                  >
                    {article.title}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Citations */}
            {selectedCitations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCitations.map((citation) => (
                  <div
                    key={citation.id}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="line-clamp-1 max-w-48">{citation.title}</span>
                    <button onClick={() => removeCitation(citation.id)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Textarea
            placeholder="متن مقاله خود را اینجا بنویسید..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[50vh] border-0 resize-none px-0 focus-visible:ring-0 bg-transparent text-base leading-relaxed"
          />
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
