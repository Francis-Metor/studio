import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <LayoutDashboard className="mr-3 text-primary" size={32} />
          Admin Dashboard
        </h1>
        <Button variant="outline" asChild>
            <Link href={ROUTES.LOGIN}>Logout</Link>
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
          <CardDescription>This is a placeholder for the admin dashboard. Full functionality will be implemented in future iterations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Admin features such as category management, candidate management, student management, voting session management, and statistics will be available here.</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          "Manage Categories", 
          "Manage Candidates", 
          "Manage Students", 
          "Voting Sessions", 
          "View Statistics", 
          "Settings"
        ].map((feature) => (
          <Card key={feature} className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{feature}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Functionality for {feature.toLowerCase()} will be added here.</p>
              <Button variant="secondary" className="mt-4" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
