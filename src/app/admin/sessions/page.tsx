
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added Input import
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Added Dialog imports
import { Timer, ArrowLeft, PauseCircle, StopCircle, PlusCircle, Save } from "lucide-react"; // Added Save Icon
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { VotingSession, VotingSessionStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const initialSessions: VotingSession[] = [
  { id: 'session1', name: 'Spring Elections 2024', startDate: '2024-03-10 09:00', endDate: '2024-03-12 17:00', status: 'Active' },
  { id: 'session2', name: 'Fall Referendum 2023', startDate: '2023-10-05 09:00', endDate: '2023-10-05 17:00', status: 'Closed' },
  { id: 'session3', name: 'Summer Council Vote', startDate: '2024-07-15 10:00', endDate: '2024-07-16 18:00', status: 'Pending' },
];

// Helper to generate unique IDs
const generateId = () => `sess_${Math.random().toString(36).substr(2, 9)}`;

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<VotingSession[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');

  useEffect(() => {
    setSessions(initialSessions);
    setIsMounted(true);
  }, []);

  const handleAddNewSession = () => {
    if (!newSessionName.trim()) {
      toast({ title: "Error", description: "Session name cannot be empty.", variant: "destructive" });
      return;
    }
    const newSession: VotingSession = {
      id: generateId(),
      name: newSessionName.trim(),
      startDate: new Date().toISOString().split('T')[0] + " 10:00",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + " 17:00", // 2 days from now
      status: 'Pending',
    };
    setSessions(prev => [newSession, ...prev]);
    toast({ title: "Session Added", description: `"${newSession.name}" created with Pending status.` });
    setIsAddSessionDialogOpen(false);
    setNewSessionName(''); // Reset for next time
  };

  const handlePauseFirstActive = () => {
    setSessions(prev => {
      const activeSessionIndex = prev.findIndex(s => s.status === 'Active');
      if (activeSessionIndex !== -1) {
        const updatedSessions = [...prev];
        updatedSessions[activeSessionIndex] = { ...updatedSessions[activeSessionIndex], status: 'Paused' };
        toast({ title: "Session Paused", description: `"${updatedSessions[activeSessionIndex].name}" is now Paused.` });
        return updatedSessions;
      }
      toast({ title: "No Active Session", description: "Could not find an active session to pause.", variant: "destructive" });
      return prev;
    });
  };

  const handleEndFirstActiveOrPaused = () => {
    setSessions(prev => {
      const targetSessionIndex = prev.findIndex(s => s.status === 'Active' || s.status === 'Paused');
      if (targetSessionIndex !== -1) {
        const updatedSessions = [...prev];
        updatedSessions[targetSessionIndex] = { ...updatedSessions[targetSessionIndex], status: 'Closed' };
        toast({ title: "Session Ended", description: `"${updatedSessions[targetSessionIndex].name}" is now Closed.` });
        return updatedSessions;
      }
      toast({ title: "No Pausable/Endable Session", description: "No active or paused session found to end.", variant: "destructive" });
      return prev;
    });
  };

  const handleSessionStatusChange = (sessionId: string, newStatus: VotingSessionStatus) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
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
          <CardDescription>Quick actions to manage sessions. These actions typically affect the first eligible session.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dialog open={isAddSessionDialogOpen} onOpenChange={setIsAddSessionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setNewSessionName(''); setIsAddSessionDialogOpen(true); }} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Voting Session</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="sessionName">Session Name</Label>
                    <Input 
                      id="sessionName" 
                      value={newSessionName} 
                      onChange={(e) => setNewSessionName(e.target.value)} 
                      placeholder="e.g., Student Council Elections Fall 2024" 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => setNewSessionName('')}>Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddNewSession}>
                    <Save className="mr-2 h-4 w-4" /> Create Session
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
          <CardTitle>Session History & Status</CardTitle>
          <CardDescription>View and manage individual voting session statuses.</CardDescription>
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
                      {/* <Button variant="outline" size="sm" disabled>
                        <Edit3 className="mr-2 h-3 w-3" /> Edit Details (Soon)
                      </Button> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No voting sessions found. Try adding one.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
