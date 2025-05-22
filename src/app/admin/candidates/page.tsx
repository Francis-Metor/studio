
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function AdminCandidatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <UsersRound className="mr-3 text-primary" size={32} />
          Manage Candidates
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
          <CardTitle>Candidates Overview</CardTitle>
          <CardDescription>Add, edit, and manage candidate information, including their photos and associated categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is for managing all candidates participating in the elections. 
            Administrators will be able to add new candidates, update their details (name, photo),
            and assign them to one or more voting categories.
          </p>
          <div className="mt-6 flex justify-end">
            <Button disabled>Add New Candidate (Coming Soon)</Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for candidate list or table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A list or table of current candidates will be displayed here, filterable by category.</p>
          {/* Example structure */}
          <div className="mt-4 space-y-2">
            <div className="p-3 border rounded-md bg-muted/50">
              <h4 className="font-semibold">Alice Wonderland</h4>
              <p className="text-sm text-muted-foreground">Category: President</p>
            </div>
            <div className="p-3 border rounded-md bg-muted/50">
              <h4 className="font-semibold">Bob The Builder</h4>
              <p className="text-sm text-muted-foreground">Category: President</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
