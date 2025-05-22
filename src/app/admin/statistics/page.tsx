
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, PieChart, Users, TrendingUp, ListChecks, Percent, SkipForward } from "lucide-react"; // Added SkipForward
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useAppState } from '@/context/AppStateContext';
import votingCategoriesData from '@/lib/voting-data.json';
import studentsData from '@/lib/students-data.json';
import type { VotingCategory, Student } from '@/lib/types';

export default function AdminStatisticsPage() {
  const { voteCounts, totalVotesCasted, skipCountsByCategory } = useAppState(); // Added skipCountsByCategory
  const categories: VotingCategory[] = votingCategoriesData as VotingCategory[];
  const allStudents: Student[] = studentsData as Student[];

  const [totalEligibleStudents, setTotalEligibleStudents] = useState(0);
  const [turnoutPercentage, setTurnoutPercentage] = useState(0);

  useEffect(() => {
    const eligible = allStudents.filter(student => student.status === 'Eligible').length;
    setTotalEligibleStudents(eligible);
  }, [allStudents]);

  useEffect(() => {
    if (totalEligibleStudents > 0) {
      // Turnout is based on students who cast at least one valid vote for a candidate
      const percentage = (totalVotesCasted / totalEligibleStudents) * 100;
      setTurnoutPercentage(parseFloat(percentage.toFixed(1)));
    } else {
      setTurnoutPercentage(0);
    }
  }, [totalVotesCasted, totalEligibleStudents]);


  const otherStats = [
    {
      title: "Participation by Department",
      value: "N/A",
      description: "Student department data not available.",
      icon: PieChart,
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
          <CardDescription>Key metrics from the voting process. Vote counts are updated in real-time for the current session.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Valid Votes Cast</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalVotesCasted}</div>
                <p className="text-xs text-muted-foreground pt-1">Total number of valid votes for candidates across all categories.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Overall Turnout</CardTitle>
                <Percent className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {totalVotesCasted} / {totalEligibleStudents} 
                  <span className="text-2xl ml-1">({turnoutPercentage}%)</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">Percentage of eligible students who cast at least one valid vote.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {otherStats.map((stat) => (
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
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 text-primary" />
            Results by Category
          </CardTitle>
          <CardDescription>Live vote counts per candidate and skipped votes within each category for the current session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.length === 0 && <p className="text-muted-foreground">No voting categories found.</p>}
          {categories.map((category) => {
            const categoryCandidateVotes = category.candidates.reduce((sum, candidate) => sum + (voteCounts[candidate.id] || 0), 0);
            const categorySkippedVotes = skipCountsByCategory[category.id] || 0;
            // Total participations in this category (votes for candidates + skips)
            // const categoryTotalParticipations = categoryCandidateVotes + categorySkippedVotes;

            return (
              <Card key={category.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>Total valid votes for candidates: {categoryCandidateVotes} &bull; Skipped votes: {categorySkippedVotes}</CardDescription>
                </CardHeader>
                <CardContent>
                  {category.candidates.length === 0 && <p className="text-sm text-muted-foreground">No candidates in this category.</p>}
                  <ul className="space-y-2">
                    {category.candidates.map((candidate) => {
                      const count = voteCounts[candidate.id] || 0;
                      const percentage = categoryCandidateVotes > 0 ? ((count / categoryCandidateVotes) * 100).toFixed(1) : "0.0";
                      return (
                        <li key={candidate.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <span className="font-medium">{candidate.name}</span>
                          <div className="text-right">
                            <span className="text-primary font-semibold">{count} vote(s)</span>
                            <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                          </div>
                        </li>
                      );
                    })}
                     {categorySkippedVotes > 0 && (
                       <li className="flex justify-between items-center p-2 border-b last:border-b-0 text-muted-foreground italic">
                         <span>Skipped Votes</span>
                         <div className="text-right">
                           <span className="font-semibold">{categorySkippedVotes}</span>
                         </div>
                       </li>
                     )}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
