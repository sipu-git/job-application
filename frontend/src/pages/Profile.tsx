import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, MapPin, Link as LinkIcon, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PostCard from "@/components/PostCard";

interface ProfileData {
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  avatar_url: string;
}

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

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    headline: "",
    bio: "",
    location: "",
    website: "",
    avatar_url: "",
  });
  const [editProfile, setEditProfile] = useState<ProfileData>(profile);
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      const p: ProfileData = {
        full_name: data.full_name || "",
        headline: data.headline || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        avatar_url: data.avatar_url || "",
      };
      setProfile(p);
      setEditProfile(p);
    }
  };

  const fetchPosts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("posts")
      .select("*, profiles!posts_user_id_fkey(full_name, headline, avatar_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setPosts((data as unknown as PostWithProfile[]) || []);
  };

  useEffect(() => {
    Promise.all([fetchProfile(), fetchPosts()]).then(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editProfile.full_name,
        headline: editProfile.headline,
        bio: editProfile.bio,
        location: editProfile.location,
        website: editProfile.website,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } else {
      setProfile(editProfile);
      setDialogOpen(false);
      toast({ title: "Profile updated!" });
    }
  };

  const initials = profile.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="h-60 animate-pulse rounded-lg bg-card border border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-5">
        {/* Profile Card */}
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden animate-fade-in">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary/80 to-primary/40" />

          <div className="relative px-6 pb-5">
            <Avatar className="-mt-14 h-28 w-28 border-4 border-card shadow-md">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="mt-3 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-card-foreground">{profile.full_name || "Your Name"}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{profile.headline || "Add a headline"}</p>
                {profile.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {profile.location}
                  </p>
                )}
                {profile.website && (
                  <a
                    href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" /> {profile.website}
                  </a>
                )}
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input value={editProfile.full_name} onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Headline</Label>
                      <Input value={editProfile.headline} onChange={(e) => setEditProfile({ ...editProfile, headline: e.target.value })} placeholder="e.g. Software Engineer at Google" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Bio</Label>
                      <Textarea value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} placeholder="Tell us about yourself..." className="min-h-[80px]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Location</Label>
                      <Input value={editProfile.location} onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })} placeholder="San Francisco, CA" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Website</Label>
                      <Input value={editProfile.website} onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })} placeholder="yourwebsite.com" />
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground hover:bg-linkedin-hover">
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {profile.bio && (
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-card-foreground mb-1">About</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="mt-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Activity</h2>
          {posts.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
              <Briefcase className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No posts yet. Share your first update!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
