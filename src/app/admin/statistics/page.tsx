
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, PieChart, TrendingUp, ListChecks, Percent, ArchiveIcon, Users } from "lucide-react"; // Added Users
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useAppState } from '@/context/AppStateContext';
// Current election structure (candidates, categories) is now from AppStateContext.votingCategories
// All students data (for eligible count) is from AppStateContext.students
import archivedElectionResultsData from '@/lib/archived-election-results.json';
import type { VotingCategory, Student, ArchivedElection, DisplayedStatistic, CandidateInVotingData } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const LIVE_DATA_SOURCE_ID = "live_current_election";

export default function AdminStatisticsPage() {
  const appState = useAppState();
  const { 
    voteCounts: liveVoteCounts, 
    skipCountsByCategory: liveSkipCountsByCategory, 
    electionName: liveElectionName,
    votedStudentIds: liveVotedStudentIds, // Use this for total students voted
    students: allStudentsFromContext, // Use this for total eligible students
    votingCategories: currentVotingCategoriesFromContext // Current election setup
  } = appState;

  const archivedElections: ArchivedElection[] = archivedElectionResultsData as ArchivedElection[];

  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string>(LIVE_DATA_SOURCE_ID);
  const [displayedStats, setDisplayedStats] = useState<DisplayedStatistic | null>(null);

  useEffect(() => {
    let newDisplayedStats: DisplayedStatistic;

    if (selectedDataSourceId === LIVE_DATA_SOURCE_ID) {
      const eligible = allStudentsFromContext.filter(student => student.status === 'Eligible').length;
      const totalStudentsWhoVoted = liveVotedStudentIds.size;
      const turnout = eligible > 0 ? parseFloat(((totalStudentsWhoVoted / eligible) * 100).toFixed(1)) : 0;
      
      newDisplayedStats = {
        electionName: liveElectionName || "Live Election",
        totalStudentsVoted: totalStudentsWhoVoted,
        totalEligibleStudents: eligible,
        turnoutPercentage: turnout,
        voteCounts: liveVoteCounts,
        skipCountsByCategory: liveSkipCountsByCategory,
        categoriesToDisplay: currentVotingCategoriesFromContext 
      };
    } else {
      const selectedArchive = archivedElections.find(archive => archive.id === selectedDataSourceId);
      if (selectedArchive) {
        newDisplayedStats = {
          electionName: selectedArchive.name,
          totalStudentsVoted: selectedArchive.totalStudentsVoted, // Ensure this field exists in JSON or derive
          totalEligibleStudents: selectedArchive.totalEligibleStudents,
          turnoutPercentage: selectedArchive.turnoutPercentage,
          voteCounts: selectedArchive.voteCounts,
          skipCountsByCategory: selectedArchive.skipCountsByCategory,
          categoriesToDisplay: selectedArchive.electionSetup.map(cat => ({
            id: cat.id,
            name: cat.name,
            candidates: cat.candidates.map(c => ({id: c.id, name: c.name, photoUrl: c.photoUrl, photoHint: c.photoHint}))
          }))
        };
      } else { // Fallback to live if archive not found
        const eligible = allStudentsFromContext.filter(student => student.status === 'Eligible').length;
        const totalStudentsWhoVoted = liveVotedStudentIds.size;
        const turnout = eligible > 0 ? parseFloat(((totalStudentsWhoVoted / eligible) * 100).toFixed(1)) : 0;
        newDisplayedStats = {
          electionName: liveElectionName || "Live Election (Error Fallback)",
          totalStudentsVoted: totalStudentsWhoVoted,
          totalEligibleStudents: eligible,
          turnoutPercentage: turnout,
          voteCounts: liveVoteCounts,
          skipCountsByCategory: liveSkipCountsByCategory,
          categoriesToDisplay: currentVotingCategoriesFromContext
        };
      }
    }
    setDisplayedStats(newDisplayedStats);
  }, [
      selectedDataSourceId, 
      liveVoteCounts, 
      liveSkipCountsByCategory, 
      liveElectionName, 
      liveVotedStudentIds, 
      allStudentsFromContext, 
      currentVotingCategoriesFromContext,
      archivedElections
    ]);


  const otherStatsPlaceholder = [
    {
      title: "Participation by Department",
      value: "N/A",
      description: "Student department data not available for current setup.",
      icon: PieChart,
    },
  ];

  if (!displayedStats) {
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
        <p>Loading statistics...</p>
      </div>
    );
  }
  
  const { 
    electionName: currentElectionName, 
    totalStudentsVoted: currentTotalStudentsVoted,
    totalEligibleStudents: currentTotalEligibleStudents,
    turnoutPercentage: currentTurnoutPercentage,
    voteCounts: currentVoteCounts,
    skipCountsByCategory: currentSkipCountsByCategory,
    categoriesToDisplay: currentCategoriesToDisplay
  } = displayedStats;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart3 className="mr-3 text-primary" size={32} />
          Voting Statistics
        </h1>
        <div className="flex items-center gap-2">
            <Label htmlFor="dataSourceSelect" className="text-sm shrink-0">View Results For:</Label>
            <Select value={selectedDataSourceId} onValueChange={setSelectedDataSourceId}>
              <SelectTrigger id="dataSourceSelect" className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LIVE_DATA_SOURCE_ID}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" /> Live Current Election
                  </div>
                </SelectItem>
                {archivedElections.map(archive => (
                  <SelectItem key={archive.id} value={archive.id}>
                    <div className="flex items-center gap-2">
                      <ArchiveIcon className="h-4 w-4 text-blue-500" /> {archive.name} (Ended: {archive.endDate})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={ROUTES.ADMIN_DASHBOARD}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Election Performance Overview
            {currentElectionName && <span className="block text-lg font-normal text-muted-foreground mt-1">For: {currentElectionName}</span>}
          </CardTitle>
          <CardDescription>
            {selectedDataSourceId === LIVE_DATA_SOURCE_ID 
              ? "Key metrics from the current voting process. Counts are updated in real-time (this session)."
              : "Archived metrics from this past election."}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Students Voted</CardTitle> {/* Changed Title */}
                <Users className="h-5 w-5 text-muted-foreground" /> {/* Changed Icon */}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{currentTotalStudentsVoted}</div>
                <p className="text-xs text-muted-foreground pt-1">Total number of unique students who cast at least one vote.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Overall Turnout</CardTitle>
                <Percent className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {currentTotalStudentsVoted} / {currentTotalEligibleStudents} 
                  <span className="text-2xl ml-1">({currentTurnoutPercentage}%)</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">Percentage of eligible students who participated.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {otherStatsPlaceholder.map((stat) => (
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
          <CardDescription>
            {selectedDataSourceId === LIVE_DATA_SOURCE_ID 
              ? "Live vote counts per candidate and skipped votes within each category."
              : "Archived vote counts per candidate and skipped votes for this election."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentCategoriesToDisplay.length === 0 && <p className="text-muted-foreground">No voting categories found for this election.</p>}
          {currentCategoriesToDisplay.map((category) => {
            const categoryCandidateVotes = category.candidates.reduce((sum, candidate) => sum + (currentVoteCounts[candidate.id] || 0), 0);
            const categorySkippedVotes = currentSkipCountsByCategory[category.id] || 0;

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
                      const count = currentVoteCounts[candidate.id] || 0;
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
