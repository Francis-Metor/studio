
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

const themeOptions = [
  { name: "Light Blue (Default)", value: "default" },
  { name: "Red", value: "theme-red" },
  { name: "Orange", value: "theme-orange" },
  { name: "Yellow", value: "theme-yellow" },
  { name: "Green", value: "theme-green" },
  { name: "Vibrant Blue", value: "theme-vibrant-blue" },
  { name: "Indigo", value: "theme-indigo" },
  { name: "Violet", value: "theme-violet" },
];

const allThemeClasses = themeOptions.map(t => t.value).filter(v => v !== "default");

export default function AdminSettingsPage() {
  const { 
    electionName: globalElectionName, 
    setElectionName: setGlobalElectionName,
    defaultSessionStartTime: globalDefaultStartTime,
    setDefaultSessionStartTime: setGlobalDefaultStartTime,
    defaultSessionEndTime: globalDefaultEndTime,
    setDefaultSessionEndTime: setGlobalDefaultEndTime,
    appTheme: globalAppTheme,
    setAppTheme: setGlobalAppTheme,
  } = useAppState();
  const { toast } = useToast();
  
  const [currentElectionName, setCurrentElectionName] = useState(globalElectionName || '');
  const [currentDefaultStartTime, setCurrentDefaultStartTime] = useState(globalDefaultStartTime || '09:00');
  const [currentDefaultEndTime, setCurrentDefaultEndTime] = useState(globalDefaultEndTime || '17:00');
  const [currentAppTheme, setCurrentAppTheme] = useState(globalAppTheme || "default");

  useEffect(() => {
    if (globalElectionName) setCurrentElectionName(globalElectionName);
    if (globalDefaultStartTime) setCurrentDefaultStartTime(globalDefaultStartTime);
    if (globalDefaultEndTime) setCurrentDefaultEndTime(globalDefaultEndTime);
    if (globalAppTheme) setCurrentAppTheme(globalAppTheme);
  }, [globalElectionName, globalDefaultStartTime, globalDefaultEndTime, globalAppTheme]);

  useEffect(() => {
    const body = document.body;
    // Remove all other theme classes
    allThemeClasses.forEach(themeClass => {
      body.classList.remove(themeClass);
    });
    // Add the new theme class if it's not default
    if (currentAppTheme !== "default") {
      body.classList.add(currentAppTheme);
    }
    // Persist to global state (primarily for consistency if other components were to read it)
    setGlobalAppTheme(currentAppTheme); 
  }, [currentAppTheme, setGlobalAppTheme]);

  const handleSaveSettings = () => {
    setGlobalElectionName(currentElectionName);
    setGlobalDefaultStartTime(currentDefaultStartTime);
    setGlobalDefaultEndTime(currentDefaultEndTime);
    // Theme is already set globally via useEffect on currentAppTheme change
    toast({
      title: "Settings Saved",
      description: "Election name, default session times, and application theme have been updated.",
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
              <Label htmlFor="appTheme">Application Theme</Label>
              <select 
                id="appTheme" 
                name="appTheme" 
                className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground" 
                value={currentAppTheme}
                onChange={(e) => setCurrentAppTheme(e.target.value)}
              >
                {themeOptions.map(theme => (
                  <option key={theme.value} value={theme.value}>{theme.name}</option>
                ))}
                <option value="dark-mode-placeholder" disabled>Dark Mode (Global Toggle Coming Soon)</option> 
              </select>
              <p className="text-xs text-muted-foreground mt-1">Changes theme immediately. Dark mode is a separate global toggle (not implemented here).</p>
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

    