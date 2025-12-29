import { useState } from "react";
import { cn } from "@/lib/utils";

const topics = [
  { id: "for-you", label: "For You" },
  { id: "science", label: "Science" },
  { id: "culture", label: "Culture" },
  { id: "economics", label: "Economics" },
  { id: "health", label: "Health" },
  { id: "art", label: "Art" },
];

interface TopicTabsProps {
  onTopicChange?: (topic: string) => void;
}

export function TopicTabs({ onTopicChange }: TopicTabsProps) {
  const [activeTab, setActiveTab] = useState("for-you");

  const handleTabChange = (topicId: string) => {
    setActiveTab(topicId);
    onTopicChange?.(topicId);
  };

  return (
    <div className="sticky top-14 z-30 bg-card/95 backdrop-blur-xl border-b border-border">
      <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-1">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTabChange(topic.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200",
              activeTab === topic.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
