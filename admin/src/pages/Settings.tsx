import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your portal preferences and configurations.
        </p>
      </div>

      {/* Portal Settings */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Portal Settings</h2>
        </div>
        <div className="form-section">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portalName">Portal Name</Label>
              <Input
                id="portalName"
                defaultValue="Government Job Portal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Administrator Email</Label>
              <Input
                id="adminEmail"
                type="email"
                defaultValue="admin@govportal.gov"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                defaultValue="Eastern Time (ET)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Notification Preferences</h2>
        </div>
        <div className="form-section">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts for new applications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Digest</p>
                <p className="text-sm text-muted-foreground">
                  Get a daily summary of portal activity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Application Deadlines</p>
                <p className="text-sm text-muted-foreground">
                  Notify when job deadlines are approaching
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Critical system notifications and updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Application Settings</h2>
        </div>
        <div className="form-section">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Archive Expired Jobs</p>
                <p className="text-sm text-muted-foreground">
                  Automatically close jobs past their deadline
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Cover Letter</p>
                <p className="text-sm text-muted-foreground">
                  Make cover letter mandatory for all applications
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Multiple Applications</p>
                <p className="text-sm text-muted-foreground">
                  Let candidates apply to multiple positions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
