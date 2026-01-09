import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FollowStats {
  followerCount: number;
  followingCount: number;
  loading: boolean;
}

export function useFollowStats(userId: string | undefined): FollowStats {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      
      const [followersRes, followingRes] = await Promise.all([
        supabase.from("follows").select("id", { count: "exact" }).eq("following_id", userId),
        supabase.from("follows").select("id", { count: "exact" }).eq("follower_id", userId),
      ]);

      setFollowerCount(followersRes.count || 0);
      setFollowingCount(followingRes.count || 0);
      setLoading(false);
    };

    fetchStats();
  }, [userId]);

  return { followerCount, followingCount, loading };
}
