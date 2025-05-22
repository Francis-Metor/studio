
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Send, UserCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import votingCategoriesData from '@/lib/voting-data.json'; // Updated import
import type { VoteSelection, VotingCategory, Candidate } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import { useAppState } from '@/context/AppStateContext';

export default function VotingArea() {
  const router = useRouter();
  const { toast } = useToast();
  const { studentDetails, logout } = useAppState();

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selections, setSelections] = useState<VoteSelection>({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cast the imported JSON data to the correct type
  const categories: VotingCategory[] = votingCategoriesData as VotingCategory[];

  useEffect(() => {
    if (!studentDetails?.studentId) {
      toast({ title: "Verification Required", description: "Please verify your student details first.", variant: "destructive" });
      router.push(ROUTES.STUDENT_VERIFY);
    }
  }, [studentDetails, router, toast]);

  const currentCategory = categories[currentCategoryIndex];
  const totalCategories = categories.length;

  const handleSelectCandidate = (categoryId: string, candidateId: string) => {
    setSelections(prev => ({ ...prev, [categoryId]: candidateId }));
  };

  const handleNext = () => {
    if (!selections[currentCategory.id]) {
      toast({ title: "Selection Required", description: `Please select a candidate for ${currentCategory.name}.`, variant: "destructive" });
      return;
    }
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    } else {
      setIsConfirming(true);
    }
  };

  const handlePrevious = () => {
    if (isConfirming) {
      setIsConfirming(false);
      return;
    }
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const handleSubmitVotes = () => {
    setIsLoading(true);
    // Mock submission
    setTimeout(() => {
      setIsLoading(false);
      console.log("Votes Submitted:", selections);
      toast({
        title: 'Votes Submitted Successfully!',
        description: 'Thank you for participating.',
        className: 'bg-green-500 text-white', 
      });
      setSelections({});
      setCurrentCategoryIndex(0);
      setIsConfirming(false);
      logout(); 
      router.push(ROUTES.STUDENT_VERIFY); 
    }, 1500);
  };

  const progressPercentage = ((currentCategoryIndex + 1) / totalCategories) * 100;

  if (!studentDetails?.studentId) {
    return <p className="text-center text-destructive">Redirecting to verification...</p>;
  }
  
  if (isConfirming) {
    return (
      <div className="space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Confirm Your Votes</CardTitle>
          <CardDescription className="text-center">Please review your selections before submitting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => {
            const selectedCandidateId = selections[category.id];
            const selectedCandidate = category.candidates.find(c => c.id === selectedCandidateId);
            return (
              <div key={category.id} className="p-3 border rounded-md bg-muted/50">
                <h4 className="font-semibold">{category.name}:</h4>
                <p className="text-primary">{selectedCandidate ? selectedCandidate.name : 'No selection'}</p>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto" disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
          </Button>
          <Button onClick={handleSubmitVotes} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Votes</>}
          </Button>
        </CardFooter>
      </div>
    );
  }

  if (!currentCategory) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>No voting categories found or error in loading.</AlertDescription></Alert>;
  }

  return (
    <div className="space-y-6">
      <Progress value={isConfirming ? 100 : progressPercentage} className="w-full mb-2" />
      <p className="text-sm text-muted-foreground text-center">
        Position {currentCategoryIndex + 1} of {totalCategories}: {currentCategory.name}
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{currentCategory.name}</CardTitle>
          <CardDescription>Select one candidate for this position.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selections[currentCategory.id] || ''}
            onValueChange={(candidateId) => handleSelectCandidate(currentCategory.id, candidateId)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentCategory.candidates.map((candidate: Candidate) => (
              <Label
                key={candidate.id}
                htmlFor={`${currentCategory.id}-${candidate.id}`}
                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-all
                  ${selections[currentCategory.id] === candidate.id ? 'border-primary bg-primary/10 shadow-md' : 'border-muted hover:bg-accent/10'}`}
              >
                <RadioGroupItem value={candidate.id} id={`${currentCategory.id}-${candidate.id}`} className="sr-only" />
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-muted">
                  {candidate.photoUrl ? (
                    <Image
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      width={96}
                      height={96}
                      className="object-cover"
                      data-ai-hint={candidate.photoHint || "person"}
                    />
                  ) : (
                    <UserCircle2 className="w-full h-full text-muted-foreground" />
                  )}
                </div>
                <span className="font-semibold text-center">{candidate.name}</span>
                {selections[currentCategory.id] === candidate.id && (
                   <Check className="w-5 h-5 text-primary absolute top-2 right-2" />
                )}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button variant="outline" onClick={handlePrevious} disabled={currentCategoryIndex === 0 || isLoading} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} disabled={isLoading || !selections[currentCategory.id]} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {currentCategoryIndex === totalCategories - 1 ? 'Review Votes' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Button variant="link" onClick={() => { logout(); router.push(ROUTES.LOGIN); }} className="w-full text-muted-foreground hover:text-primary">
        Cancel and Logout
      </Button>
    </div>
  );
}
