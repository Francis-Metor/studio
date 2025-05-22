
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, PieChart, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function AdminStatisticsPage() {
  const placeholderStats = [
    {
      title: "Overall Turnout",
      value: "72%",
      description: "Percentage of eligible students who voted.",
      icon: Users,
    },
    {
      title: "Total Votes Cast",
      value: "1,234",
      description: "Total number of votes recorded across all categories.",
      icon: TrendingUp,
    },
    {
      title: "Participation by Department",
      value: "Coming Soon",
      description: "Breakdown of voter turnout by academic department.",
      icon: PieChart,
    },
     {
      title: "Results: President",
      value: "Jane Doe (55%)",
      description: "Leading candidate for President.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart3 className="mr-3 text-primary" size={32} />
          Voting Statistics
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
          <CardTitle>Election Performance Overview</CardTitle>
          <CardDescription>Key metrics and insights from the voting process. Detailed charts and reports will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will provide visual representations of voting data, including turnout rates,
            results per category, and other relevant analytics to help understand election outcomes.
            For now, these are placeholder statistics.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {placeholderStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Detailed Charts (Placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/30 text-center">
                <PieChart className="h-16 w-16 mx-auto text-primary/70 mb-2" />
                <p className="text-muted-foreground">Placeholder for Votes Distribution Chart</p>
            </div>
             <div className="p-4 border rounded-md bg-muted/30 text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-primary/70 mb-2" />
                <p className="text-muted-foreground">Placeholder for Candidate Performance Chart</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}

