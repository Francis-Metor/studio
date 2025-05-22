
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, ArrowLeft, PlayCircle, PauseCircle, StopCircle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function AdminSessionsPage() {
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
          <CardDescription>Configure, start, pause, resume, and end voting periods. Monitor active session status.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section allows administrators to control the lifecycle of voting sessions.
            You'll be able to define the start and end times for an election,
            activate a session, pause it if necessary, and formally close it once voting is complete.
            Real-time monitoring (e.g., voter turnout) might also be displayed here in future iterations.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button disabled className="w-full">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start New Session (Coming Soon)
            </Button>
             <Button disabled variant="secondary" className="w-full">
              <PauseCircle className="mr-2 h-4 w-4" />
              Pause Active Session (Coming Soon)
            </Button>
            <Button disabled variant="destructive" className="w-full">
              <StopCircle className="mr-2 h-4 w-4" />
              End Active Session (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for session list or details of active/past sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Session History & Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Details of current and past voting sessions will be listed here.</p>
          {/* Example structure */}
          <div className="mt-4 space-y-3">
            <div className="p-4 border rounded-md bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-700">Spring Elections 2024 - ACTIVE</h4>
              <p className="text-sm text-green-600">Started: 2024-03-10 09:00 | Ends: 2024-03-12 17:00</p>
              <p className="text-sm text-green-600">Voter Turnout: 45% (placeholder)</p>
            </div>
            <div className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-semibold">Fall Referendum 2023 - CLOSED</h4>
              <p className="text-sm text-muted-foreground">Started: 2023-10-05 09:00 | Ended: 2023-10-05 17:00</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
