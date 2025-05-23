
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersRound, ArrowLeft, PlusCircle, Edit, Trash2, Save, UserCircle2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { CandidateInVotingData, VotingCategory, DisplayCandidate, Category as SimpleCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from '@/context/AppStateContext';

const generateId = () => `cand_${Math.random().toString(36).substr(2, 9)}`;

export default function AdminCandidatesPage() {
  const { 
    votingCategories, 
    addCandidateToCategory, 
    updateCandidateInCategory, 
    deleteCandidateFromCategory 
  } = useAppState();

  const [displayCandidates, setDisplayCandidates] = useState<DisplayCandidate[]>([]);
  const [availableSimpleCategories, setAvailableSimpleCategories] = useState<SimpleCategory[]>([]);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state for Add/Edit Dialog
  const [currentCandidate, setCurrentCandidate] = useState<DisplayCandidate | null>(null); // Holds candidate being edited
  const [candidateName, setCandidateName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // For the dropdown
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoHint, setPhotoHint] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Transform votingCategories from context into displayCandidates and availableSimpleCategories
    const simpleCategories: SimpleCategory[] = votingCategories.map(cat => ({ id: cat.id, name: cat.name }));
    setAvailableSimpleCategories(simpleCategories);

    const flatCandidates: DisplayCandidate[] = [];
    votingCategories.forEach(category => {
      category.candidates.forEach(rawCandidate => {
        flatCandidates.push({
          ...rawCandidate,
          categoryId: category.id, // Assign categoryId
          categoryName: category.name,
        });
      });
    });
    setDisplayCandidates(flatCandidates);
  }, [votingCategories]);


  const resetFormFields = () => {
    setCandidateName('');
    setSelectedCategoryId('');
    setPhotoUrl('');
    setPhotoHint('');
    setCurrentCandidate(null);
  };

  const handleAddCandidateClick = () => {
    resetFormFields();
    setIsFormOpen(true);
  };

  const handleEditCandidateClick = (candidate: DisplayCandidate) => {
    setCurrentCandidate(candidate);
    setCandidateName(candidate.name);
    setSelectedCategoryId(candidate.categoryId);
    setPhotoUrl(candidate.photoUrl || '');
    setPhotoHint(candidate.photoHint || '');
    setIsFormOpen(true);
  };

  const handleDeleteCandidateConfirmed = (candidate: DisplayCandidate) => {
    deleteCandidateFromCategory(candidate.categoryId, candidate.id);
    toast({ title: "Candidate Deleted", description: "The candidate has been removed." });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !selectedCategoryId) {
      toast({ title: "Error", description: "Candidate name and category are required.", variant: "destructive" });
      return;
    }

    if (currentCandidate) { // Editing existing candidate
      const updatedCand: CandidateInVotingData = {
        id: currentCandidate.id,
        name: candidateName.trim(),
        photoUrl: photoUrl.trim() || undefined,
        photoHint: photoHint.trim() || undefined,
      };
      updateCandidateInCategory(selectedCategoryId, updatedCand); // Use selectedCategoryId if category can change
      toast({ title: "Candidate Updated", description: "The candidate has been successfully updated." });
    } else { // Adding new candidate
      const newCand: CandidateInVotingData = {
        id: generateId(),
        name: candidateName.trim(),
        photoUrl: photoUrl.trim() || undefined,
        photoHint: photoHint.trim() || undefined,
      };
      addCandidateToCategory(selectedCategoryId, newCand);
      toast({ title: "Candidate Added", description: "The new candidate has been successfully added." });
    }
    setIsFormOpen(false);
    resetFormFields();
  };
  
  if (!isMounted) {
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
            <CardDescription>Loading candidates...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-muted rounded w-full mb-2"></div>
              <div className="h-10 bg-muted rounded w-full mb-2"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardDescription>Add, edit, and manage candidate information. Candidates are part of the current election setup.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) resetFormFields(); }}>
              <DialogTrigger asChild>
                <Button onClick={handleAddCandidateClick}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Candidate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{currentCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitForm} className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="candidateName">Name</Label>
                    <Input id="candidateName" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="e.g., John Doe" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSimpleCategories.length === 0 && <SelectItem value="no-cat" disabled>No categories available</SelectItem>}
                        {availableSimpleCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://placehold.co/150x150.png" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="photoHint">Photo Hint (for AI)</Label>
                    <Input id="photoHint" value={photoHint} onChange={(e) => setPhotoHint(e.target.value)} placeholder="e.g., person smiling" />
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={availableSimpleCategories.length === 0 && !currentCandidate}>
                      <Save className="mr-2 h-4 w-4" /> {currentCandidate ? 'Save Changes' : 'Create Candidate'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {displayCandidates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayCandidates.map((candidate) => (
                  <TableRow key={`${candidate.categoryId}-${candidate.id}`}>
                    <TableCell>
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={candidate.photoUrl || `https://placehold.co/96x96.png?text=${candidate.name.charAt(0)}`} alt={candidate.name} data-ai-hint={candidate.photoHint || "person"} />
                        <AvatarFallback><UserCircle2 className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.categoryName}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCandidateClick(candidate)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the candidate &quot;{candidate.name}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCandidateConfirmed(candidate)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No candidates found. Add categories and then candidates.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
