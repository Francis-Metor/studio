
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTree, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <ListTree className="mr-3 text-primary" size={32} />
          Manage Voting Categories
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
          <CardTitle>Categories Overview</CardTitle>
          <CardDescription>Create, edit, and delete voting categories. Assign candidates to relevant categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow administrators to manage the different positions or topics
            that students can vote on (e.g., President, Secretary, Best Project).
            Functionality for adding new categories, modifying existing ones, and organizing
            their display order will be implemented here.
          </p>
          <div className="mt-6 flex justify-end">
            <Button disabled>Add New Category (Coming Soon)</Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for category list or table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A list or table of current voting categories will be displayed here.</p>
          {/* Example structure - can be replaced with actual data mapping later */}
          <ul className="mt-4 space-y-2">
            <li className="p-3 border rounded-md bg-muted/50">President (3 candidates)</li>
            <li className="p-3 border rounded-md bg-muted/50">Secretary (2 candidates)</li>
            <li className="p-3 border rounded-md bg-muted/50">Treasurer (3 candidates)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
