
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, ArrowLeft, Save, Vote, PlayCircle } from "lucide-react"; // Added PlayCircle
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

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
    allowSkipVote: globalAllowSkipVote,
    setAllowSkipVote: setGlobalAllowSkipVote,
    addSession, // For adding a new session
    clearVoteCounts, // For resetting statistics
  } = useAppState();
  const { toast } = useToast();
  
  // This state is for the input field for a *new* election name
  const [newElectionNameInput, setNewElectionNameInput] = useState(globalElectionName || 'New Election Cycle');
  
  // These states are for settings NOT tied to starting a new cycle (theme, defaults, skip vote)
  const [currentDefaultStartTime, setCurrentDefaultStartTime] = useState(globalDefaultStartTime || '09:00');
  const [currentDefaultEndTime, setCurrentDefaultEndTime] = useState(globalDefaultEndTime || '17:00');
  const [currentAppTheme, setCurrentAppTheme] = useState(globalAppTheme || "default");
  const [currentAllowSkipVote, setCurrentAllowSkipVote] = useState(globalAllowSkipVote);

  useEffect(() => {
    // Sync local form states if global values change (e.g., on initial load)
    if (globalDefaultStartTime) setCurrentDefaultStartTime(globalDefaultStartTime);
    if (globalDefaultEndTime) setCurrentDefaultEndTime(globalDefaultEndTime);
    if (globalAppTheme) setCurrentAppTheme(globalAppTheme);
    setCurrentAllowSkipVote(globalAllowSkipVote);
    // setNewElectionNameInput might not need to sync back from globalElectionName constantly
    // if globalElectionName represents the *active* election, and this input is for a *new* one.
    // However, for simplicity on load, we can set it.
    if (globalElectionName && !newElectionNameInput) setNewElectionNameInput(globalElectionName);

  }, [globalDefaultStartTime, globalDefaultEndTime, globalAppTheme, globalAllowSkipVote, globalElectionName, newElectionNameInput]);

  useEffect(() => {
    const body = document.body;
    allThemeClasses.forEach(themeClass => {
      body.classList.remove(themeClass);
    });
    if (currentAppTheme !== "default") {
      body.classList.add(currentAppTheme);
    }
    // No need to call setGlobalAppTheme here if handleSaveDisplaySettings does it
  }, [currentAppTheme]);

  const handleStartNewElectionCycle = () => {
    if (!newElectionNameInput.trim()) {
      toast({ title: "Error", description: "New election name cannot be empty.", variant: "destructive" });
      return;
    }
    setGlobalElectionName(newElectionNameInput.trim()); // Set the active election name
    addSession({ name: newElectionNameInput.trim() }); // Add to global sessions list
    clearVoteCounts(); // Reset all voting statistics
    toast({
      title: "New Election Cycle Started",
      description: `"${newElectionNameInput.trim()}" is now the active election. It has been added to sessions as 'Pending'. All statistics have been reset.`,
    });
    // Optionally reset the input field for the next new election, or keep it.
    // setNewElectionNameInput(''); 
  };
  
  const handleSaveDisplaySettings = () => {
    // These settings affect the current display/behavior but don't start a new cycle or reset stats.
    setGlobalDefaultStartTime(currentDefaultStartTime);
    setGlobalDefaultEndTime(currentDefaultEndTime);
    setGlobalAppTheme(currentAppTheme); // Set theme globally
    setGlobalAllowSkipVote(currentAllowSkipVote);
    toast({
      title: "Display Settings Saved",
      description: "Default session times, theme, and skip vote option have been updated.",
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
          <CardTitle>New Election Cycle</CardTitle>
          <CardDescription>Define the name for a new election cycle. Starting a new cycle will reset all current voting statistics and add this as a new 'Pending' session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="newElectionName">New Election Name</Label>
            <Input 
              type="text" 
              name="newElectionName" 
              id="newElectionName" 
              className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" 
              placeholder="e.g., Fall Student Council Elections 2024" 
              value={newElectionNameInput}
              onChange={(e) => setNewElectionNameInput(e.target.value)}
            />
          </div>
           <Button onClick={handleStartNewElectionCycle} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlayCircle className="mr-2 h-4 w-4" />
            Start New Election Cycle & Reset Stats
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Display & Default Settings</CardTitle>
          <CardDescription>Manage general display preferences and default times for new sessions. These settings do not reset statistics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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

            <div className="flex items-center space-x-2">
              <Switch 
                id="allowSkipVote" 
                checked={currentAllowSkipVote}
                onCheckedChange={setCurrentAllowSkipVote}
              />
              <Label htmlFor="allowSkipVote">Allow Skipping Votes</Label>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">
              If enabled, students can choose to skip voting for a category.
            </p>

            <Button onClick={handleSaveDisplaySettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Display & Time Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert className="mt-6">
        <Vote className="h-4 w-4" />
        <AlertTitle>Important Notes</AlertTitle>
        <AlertDescription>
          "Starting a New Election Cycle" sets the entered name as the current election, adds it to the sessions list, and resets all voting statistics.
          "Save Display & Time Settings" updates visual and default settings without affecting election data or starting a new cycle.
        </AlertDescription>
      </Alert>
    </div>
  );
}
