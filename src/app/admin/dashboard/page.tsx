
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LayoutDashboard, ListTree, UsersRound, ClipboardList, Timer, Settings, BarChart3 } from "lucide-react"; // Changed icon for stats
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

function FeatureCard({ title, description, href, icon: Icon, comingSoon = false }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="text-primary" size={24} />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        {comingSoon ? (
          <Button variant="secondary" className="w-full mt-4" disabled>Coming Soon</Button>
        ) : (
          <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={href}>Manage</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const features: FeatureCardProps[] = [
    { 
      title: "Manage Categories", 
      description: "Define and organize voting categories.",
      href: ROUTES.ADMIN_CATEGORIES,
      icon: ListTree
    },
    { 
      title: "Manage Candidates", 
      description: "Add, edit, and assign candidates to categories.",
      href: ROUTES.ADMIN_CANDIDATES,
      icon: UsersRound 
    },
    { 
      title: "Manage Students", 
      description: "View student data and eligibility. Supports Excel imports.",
      href: ROUTES.ADMIN_STUDENTS,
      icon: ClipboardList
    },
    { 
      title: "Voting Sessions", 
      description: "Control and monitor election periods.",
      href: ROUTES.ADMIN_SESSIONS,
      icon: Timer
    },
    { 
      title: "View Statistics", 
      description: "Analyze voting results and participation.",
      href: ROUTES.ADMIN_STATISTICS, 
      icon: BarChart3, 
      comingSoon: false 
    },
    { 
      title: "Settings", 
      description: "Configure application settings.",
      href: ROUTES.ADMIN_SETTINGS, // Updated href
      icon: Settings,
      comingSoon: false // Updated comingSoon status
    },
  ];

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
          <CardDescription>Oversee and manage all aspects of the CampusVote system from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Use the sections below to navigate to different management areas. More features and detailed statistics will be available in future updates.</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
