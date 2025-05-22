
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardUser, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AdminStudentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <ClipboardUser className="mr-3 text-primary" size={32} />
          Manage Students
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
          <CardTitle>Student Data Management</CardTitle>
          <CardDescription>View registered student information and manage their eligibility for voting. Student data is typically imported via Excel.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This area will provide tools to manage student records. Key functionality will include
            viewing student lists, searching for specific students, and managing their voting status.
            An important feature will be the ability to import student data from Excel spreadsheets
            to easily populate or update the system.
          </p>
          <Alert className="mt-4">
            <Upload className="h-4 w-4" />
            <AlertTitle>Excel Import</AlertTitle>
            <AlertDescription>
              Functionality to import student data from Excel files (e.g., .xlsx, .csv) will be available here. This will allow for bulk additions and updates of student records.
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <Button disabled variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Students (Coming Soon)
            </Button>
            <Button disabled>Add New Student Manually (Coming Soon)</Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for student list or table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A searchable and filterable list/table of students will appear here once data is populated.</p>
           {/* Example structure */}
          <div className="mt-4 space-y-2">
            <div className="p-3 border rounded-md bg-muted/50">
              <h4 className="font-semibold">S12345 - John Doe</h4>
              <p className="text-sm text-muted-foreground">Status: Eligible</p>
            </div>
            <div className="p-3 border rounded-md bg-muted/50">
              <h4 className="font-semibold">S67890 - Jane Smith</h4>
              <p className="text-sm text-muted-foreground">Status: Voted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
