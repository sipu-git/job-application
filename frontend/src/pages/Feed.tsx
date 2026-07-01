import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import CreatePostCard from "@/components/CreatePostCard";
import PostCard from "@/components/PostCard";
import { Briefcase, Users, TrendingUp } from "lucide-react";

interface PostWithProfile {
  id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    headline: string | null;
    avatar_url: string | null;
  } | null;
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles!posts_user_id_fkey(full_name, headline, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);
    setPosts((data as unknown as PostWithProfile[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[240px_1fr_240px]">
          {/* Left sidebar */}
          <aside className="hidden lg:block">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 h-14 rounded-t-lg bg-primary/10" />
              <h3 className="text-sm font-semibold text-card-foreground">
                {user?.user_metadata?.full_name || "User"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Welcome to JobPlatform</p>
              <div className="mt-4 space-y-2 border-t border-border pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Profile views</span>
                  <span className="font-semibold text-primary">42</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="font-semibold text-primary">128</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main feed */}
          <div className="space-y-4">
            <CreatePostCard onPostCreated={fetchPosts} />
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-lg bg-card border border-border" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center shadow-sm">
                <Briefcase className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-sm font-semibold text-card-foreground">No posts yet</h3>
                <p className="text-xs text-muted-foreground mt-1">Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
              ))
            )}
          </div>

          {/* Right sidebar */}
          <aside className="hidden lg:block space-y-4">
            {/* Trending */}
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-card-foreground">Trending</h3>
              <div className="space-y-3">
                {["#Hiring", "#RemoteWork", "#TechJobs", "#Career"].map((tag) => (
                  <div key={tag} className="group cursor-pointer">
                    <p className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors">
                      {tag}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {Math.floor(Math.random() * 500 + 100)} posts
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad 1 */}
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-accent p-4">
                <p className="text-[10px] text-muted-foreground mb-1">Sponsored</p>
                <h4 className="text-sm font-semibold text-card-foreground leading-snug">Upskill with LinkedIn Learning</h4>
                <p className="text-xs text-muted-foreground mt-1">Get 1 month free access to 16,000+ courses.</p>
              </div>
              <div className="px-4 py-2.5">
                <button className="w-full rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent transition-colors">
                  Try for Free
                </button>
              </div>
            </div>

            {/* Ad 2 */}
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-4">
                <p className="text-[10px] text-muted-foreground mb-1">Sponsored</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-card-foreground">TechCorp Inc.</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">We're hiring! Join our team of 500+ engineers building the future of cloud computing.</p>
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button className="w-full rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-linkedin-hover transition-colors">
                  View Jobs
                </button>
              </div>
            </div>

            {/* Ad 3 */}
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-[10px] text-muted-foreground mb-2">Sponsored</p>
              <h4 className="text-xs font-semibold text-card-foreground">Boost your resume with AI</h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">ResumeAI helps you craft the perfect resume in minutes. Trusted by 2M+ professionals.</p>
              <a href="#" className="mt-2 inline-block text-xs font-medium text-primary hover:underline">Learn more →</a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Feed;
