import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const categories = [
  { id: "all", label: "همه" },
  { id: "politics", label: "سیاست" },
  { id: "culture", label: "فرهنگ" },
  { id: "science", label: "علم" },
  { id: "society", label: "جامعه" },
  { id: "economics", label: "اقتصاد" },
  { id: "art", label: "هنر" },
  { id: "history", label: "تاریخ" },
];

interface CategoryPillsProps {
  onCategoryChange?: (category: string) => void;
}

export function CategoryPills({ onCategoryChange }: CategoryPillsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const isHeaderVisible = useScrollDirection();

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div 
      className={cn(
        "sticky z-30 transition-all duration-300",
        isHeaderVisible ? "top-[68px]" : "top-0"
      )}
    >
      <div className="mx-3">
        <div className="glass rounded-xl border border-border/30">
          <div className="flex overflow-x-auto hide-scrollbar px-3 py-2.5 gap-1.5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded-lg whitespace-nowrap transition-all duration-250",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
