
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { 
    electionName: globalElectionName, 
    setElectionName: setGlobalElectionName,
    defaultSessionStartTime: globalDefaultStartTime,
    setDefaultSessionStartTime: setGlobalDefaultStartTime,
    defaultSessionEndTime: globalDefaultEndTime,
    setDefaultSessionEndTime: setGlobalDefaultEndTime,
  } = useAppState();
  const { toast } = useToast();
  
  const [currentElectionName, setCurrentElectionName] = useState(globalElectionName || '');
  const [currentDefaultStartTime, setCurrentDefaultStartTime] = useState(globalDefaultStartTime || '09:00');
  const [currentDefaultEndTime, setCurrentDefaultEndTime] = useState(globalDefaultEndTime || '17:00');
  const [appTheme, setAppTheme] = useState("Light Blue (Default)"); // Placeholder

  useEffect(() => {
    if (globalElectionName) {
      setCurrentElectionName(globalElectionName);
    }
    if (globalDefaultStartTime) {
      setCurrentDefaultStartTime(globalDefaultStartTime);
    }
    if (globalDefaultEndTime) {
      setCurrentDefaultEndTime(globalDefaultEndTime);
    }
  }, [globalElectionName, globalDefaultStartTime, globalDefaultEndTime]);

  const handleSaveSettings = () => {
    setGlobalElectionName(currentElectionName);
    setGlobalDefaultStartTime(currentDefaultStartTime);
    setGlobalDefaultEndTime(currentDefaultEndTime);
    toast({
      title: "Settings Saved",
      description: "Election name and default session times have been updated.",
    });
  };

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
          <div className="space-y-6">
            <div>
              <Label htmlFor="electionName">Election Name</Label>
              <Input 
                type="text" 
                name="electionName" 
                id="electionName" 
                className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" 
                placeholder="e.g., Spring General Elections" 
                value={currentElectionName}
                onChange={(e) => setCurrentElectionName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultStartTime">Default Session Start Time</Label>
                <Input 
                  type="time" 
                  name="defaultStartTime" 
                  id="defaultStartTime" 
                  className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" 
                  value={currentDefaultStartTime}
                  onChange={(e) => setCurrentDefaultStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="defaultEndTime">Default Session End Time</Label>
                <Input 
                  type="time" 
                  name="defaultEndTime" 
                  id="defaultEndTime" 
                  className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" 
                  value={currentDefaultEndTime}
                  onChange={(e) => setCurrentDefaultEndTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="appTheme">Application Theme (Visual Only)</Label>
              <select 
                id="appTheme" 
                name="appTheme" 
                className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground" 
                value={appTheme}
                onChange={(e) => setAppTheme(e.target.value)}
                disabled 
              >
                <option>Light Blue (Default)</option>
                <option>Dark Mode</option>
                <option>University Branded</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">Theme selection is currently a visual placeholder and does not change the application's theme.</p>
            </div>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert className="mt-6">
        <Settings className="h-4 w-4" />
        <AlertTitle>Additional Settings Placeholder</AlertTitle>
        <AlertDescription>
          More settings could be added here in the future, such as:
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Email notification configurations.</li>
            <li>Date formats or timezones.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
