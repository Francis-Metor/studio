
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Settings className="mr-3 text-primary" size={32} />
          Application Settings
        </h1>
        <Button variant="outline" asChild>
          <Link href={ROUTES.ADMIN_DASHBOARD}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Manage general settings for the CampusVote application.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is intended for configuring application-wide parameters such as the election name,
            visual theme preferences, email notification settings (if applicable), and other global options
            that affect the entire system.
          </p>
          <Alert className="mt-6">
            <Settings className="h-4 w-4" />
            <AlertTitle>Placeholder Content</AlertTitle>
            <AlertDescription>
              Currently, these settings are for demonstration purposes only and are not functional.
              Future development could include:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Setting the main election title.</li>
                <li>Choosing a color theme or uploading a logo.</li>
                <li>Configuring date formats or timezones.</li>
                <li>Setting default behaviors for new voting sessions.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Example Setting Section</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div>
                    <label htmlFor="electionName" className="block text-sm font-medium text-foreground">Election Name</label>
                    <input type="text" name="electionName" id="electionName" className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" placeholder="e.g., Spring General Elections" disabled/>
                </div>
                <div>
                    <label htmlFor="appTheme" className="block text-sm font-medium text-foreground">Application Theme</label>
                    <select id="appTheme" name="appTheme" className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" disabled>
                        <option>Light Blue (Default)</option>
                        <option>Dark Mode</option>
                        <option>University Branded</option>
                    </select>
                </div>
                 <Button disabled>Save Settings (Coming Soon)</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
