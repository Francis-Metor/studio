
'use client';

import { useState, useEffect } from 'react'; // Removed unused 'useState'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Timer, ArrowLeft, PauseCircle, StopCircle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { VotingSession, VotingSessionStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppState } from '@/context/AppStateContext'; // Import useAppState

export default function AdminSessionsPage() {
  const { 
    sessions, 
    setSessions, 
    updateSessionStatus // Use global updateSessionStatus
  } = useAppState(); 
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const handlePauseFirstActive = () => {
    const activeSessionIndex = sessions.findIndex(s => s.status === 'Active');
    if (activeSessionIndex !== -1) {
      const updatedSessionId = sessions[activeSessionIndex].id;
      updateSessionStatus(updatedSessionId, 'Paused'); // Update global state
      toast({ title: "Session Paused", description: `"${sessions[activeSessionIndex].name}" is now Paused.` });
    } else {
      toast({ title: "No Active Session", description: "Could not find an active session to pause.", variant: "destructive" });
    }
  };

  const handleEndFirstActiveOrPaused = () => {
    const targetSessionIndex = sessions.findIndex(s => s.status === 'Active' || s.status === 'Paused');
    if (targetSessionIndex !== -1) {
      const updatedSessionId = sessions[targetSessionIndex].id;
      updateSessionStatus(updatedSessionId, 'Closed'); // Update global state
      toast({ title: "Session Ended", description: `"${sessions[targetSessionIndex].name}" is now Closed.` });
    } else {
      toast({ title: "No Pausable/Endable Session", description: "No active or paused session found to end.", variant: "destructive" });
    }
  };

  const handleSessionStatusChange = (sessionId: string, newStatus: VotingSessionStatus) => {
    updateSessionStatus(sessionId, newStatus); // Update global state
    toast({ title: "Status Updated", description: `Session status changed to ${newStatus}.` });
  };

  const getStatusColor = (status: VotingSessionStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500 hover:bg-green-600';
      case 'Paused': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Pending': return 'bg-blue-500 hover:bg-blue-600';
      case 'Closed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-muted';
    }
  };
  
  const availableStatuses: VotingSessionStatus[] = ['Pending', 'Active', 'Paused', 'Closed'];

  if (!isMounted) {
    return (
       <div className="space-y-8">
         <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center">
            <Timer className="mr-3 text-primary" size={32} />
            Manage Voting Sessions
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
            <CardTitle>Session History & Status</CardTitle>
             <CardDescription>Loading sessions...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-muted rounded w-full mb-2"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Timer className="mr-3 text-primary" size={32} />
          Manage Voting Sessions
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
          <CardTitle>Voting Session Control</CardTitle>
          <CardDescription>Quick actions to manage sessions. These actions typically affect the first eligible session. New sessions are created via the Admin Settings page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Button onClick={handlePauseFirstActive} variant="secondary" className="w-full">
              <PauseCircle className="mr-2 h-4 w-4" />
              Pause First Active
            </Button>
            <Button onClick={handleEndFirstActiveOrPaused} variant="destructive" className="w-full">
              <StopCircle className="mr-2 h-4 w-4" />
              End First Active/Paused
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session History & Status ({sessions.length})</CardTitle>
          <CardDescription>View and manage individual voting session statuses. Sessions are loaded initially and new ones can be added via Settings.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{session.name}</CardTitle>
                        <CardDescription>
                          {session.startDate} - {session.endDate}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor(session.status)} text-white border-transparent`}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                     <Label htmlFor={`status-${session.id}`} className="text-sm font-medium">Change Status:</Label>
                     <Select 
                        value={session.status} 
                        onValueChange={(newStatus: VotingSessionStatus) => handleSessionStatusChange(session.id, newStatus)}
                      >
                        <SelectTrigger id={`status-${session.id}`} className="w-[180px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No voting sessions found. New sessions can be started from the Admin Settings page.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
