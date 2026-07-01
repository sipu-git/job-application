import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostCardProps {
  onPostCreated: () => void;
}

const CreatePostCard = ({ onPostCreated }: CreatePostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  const handlePost = async () => {
    if (!content.trim() || !user) return;
    setIsPosting(true);
    const { error } = await supabase.from("posts").insert({
      content: content.trim(),
      user_id: user.id,
    });
    setIsPosting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" });
    } else {
      setContent("");
      setExpanded(false);
      toast({ title: "Posted!", description: "Your post is now live." });
      onPostCreated();
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full rounded-full border border-border px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              Start a post...
            </button>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="min-h-[100px] resize-none border-none bg-transparent p-0 text-sm focus-visible:ring-0"
                autoFocus
              />
              <div className="flex items-center justify-between border-t border-border pt-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Image className="mr-1.5 h-4 w-4" /> Photo
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setExpanded(false); setContent(""); }}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePost}
                    disabled={!content.trim() || isPosting}
                    className="bg-primary text-primary-foreground hover:bg-linkedin-hover"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    {isPosting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostCard;
