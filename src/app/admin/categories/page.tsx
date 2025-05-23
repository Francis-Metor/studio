
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ListTree, ArrowLeft, PlusCircle, Edit, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { VotingCategory as CategoryType } from "@/lib/types"; // Using VotingCategory as the base type
import { useToast } from "@/hooks/use-toast";
import { useAppState } from '@/context/AppStateContext';

const generateId = () => `cat_${Math.random().toString(36).substr(2, 9)}`;

export default function AdminCategoriesPage() {
  const { 
    votingCategories, 
    addCategory, 
    updateCategoryName, 
    deleteCategory 
  } = useAppState();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setCategoryNameInput('');
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: CategoryType) => {
    setCurrentCategory(category);
    setCategoryNameInput(category.name);
    setIsFormOpen(true);
  };

  const handleDeleteCategoryConfirmed = (categoryId: string) => {
    deleteCategory(categoryId);
    toast({ title: "Category Deleted", description: "The category and its associated candidates (from the current view) have been removed." });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }

    if (currentCategory) {
      // Edit mode
      updateCategoryName(currentCategory.id, categoryNameInput.trim());
      toast({ title: "Category Updated", description: "The category has been successfully updated." });
    } else {
      // Add mode
      const newCategory = { id: generateId(), name: categoryNameInput.trim() }; // candidates array will be empty
      addCategory(newCategory);
      toast({ title: "Category Added", description: "The new category has been successfully added." });
    }
    setIsFormOpen(false);
    setCategoryNameInput('');
    setCurrentCategory(null);
  };
  
  if (!isMounted) {
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
            <CardDescription>Loading categories...</CardDescription>
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
          <CardDescription>Create, edit, and delete voting categories. These categories will be used to group candidates. Changes affect the current election setup.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) { setCategoryNameInput(''); setCurrentCategory(null); } }}>
              <DialogTrigger asChild>
                <Button onClick={handleAddCategory}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{currentCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitForm} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryNameInput" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="categoryNameInput"
                      value={categoryNameInput}
                      onChange={(e) => setCategoryNameInput(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., President, Secretary"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" /> {currentCategory ? 'Save Changes' : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {votingCategories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>No. of Candidates</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {votingCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.candidates.length}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete" disabled={category.candidates.length > 0}>
                            <Trash2 className={`h-4 w-4 ${category.candidates.length > 0 ? 'text-muted-foreground' : 'text-destructive'}`} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the category &quot;{category.name}&quot;.
                              {category.candidates.length > 0 && " This category still has candidates. Please remove them first."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCategoryConfirmed(category.id)} 
                              className="bg-destructive hover:bg-destructive/90"
                              disabled={category.candidates.length > 0}
                            >
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
            <p className="text-muted-foreground text-center py-4">No categories found. Add one to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
