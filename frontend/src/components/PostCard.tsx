import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface PostCardProps {
  post: PostWithProfile;
  onUpdate: () => void;
}

const PostCard = ({ post, onUpdate }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const initials = post.profiles?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  useEffect(() => {
    if (!user) return;
    supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [post.id, user]);

  const toggleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
      setLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
      await supabase.from("posts").update({ likes_count: Math.max(0, likesCount - 1) }).eq("id", post.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: user.id });
      setLiked(true);
      setLikesCount((c) => c + 1);
      await supabase.from("posts").update({ likes_count: likesCount + 1 }).eq("id", post.id);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold text-card-foreground leading-tight">
              {post.profiles?.full_name || "Unknown"}
            </h4>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
              {post.profiles?.headline || "Member"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-card-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Stats */}
      {likesCount > 0 && (
        <div className="mx-4 flex items-center gap-1 border-b border-border pb-2 text-xs text-muted-foreground">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">👍</span>
          <span>{likesCount}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-around p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          className={`flex-1 gap-1.5 text-xs font-medium ${liked ? "text-primary" : "text-muted-foreground"}`}
        >
          <ThumbsUp className="h-4 w-4" /> Like
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs font-medium text-muted-foreground">
          <MessageCircle className="h-4 w-4" /> Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs font-medium text-muted-foreground">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
