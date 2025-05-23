
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, ArrowLeft, Upload, UserPlus, Edit3, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Student } from '@/lib/types';
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const generateId = () => `s_${Math.random().toString(36).substr(2, 9)}`;

export default function AdminStudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent, setStudents: setGlobalStudents } = useAppState();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  // Form state for Add/Edit Dialog
  const [studentIdInput, setStudentIdInput] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentStatusInput, setStudentStatusInput] = useState<Student['status']>('Eligible');

  const studentStatuses: Student['status'][] = ['Eligible', 'Voted', 'Ineligible'];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resetFormFields = () => {
    setStudentIdInput('');
    setStudentNameInput('');
    setStudentStatusInput('Eligible');
    setCurrentStudent(null);
  };

  const handleAddStudentClick = () => {
    resetFormFields();
    setIsFormOpen(true);
  };

  const handleEditStudentClick = (student: Student) => {
    setCurrentStudent(student);
    setStudentIdInput(student.id);
    setStudentNameInput(student.name);
    setStudentStatusInput(student.status);
    setIsFormOpen(true);
  };

  const handleDeleteStudentConfirmed = (studentId: string) => {
    deleteStudent(studentId);
    toast({ title: "Student Deleted", description: "The student has been removed from the list." });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim() || !studentNameInput.trim()) {
      toast({ title: "Error", description: "Student ID and Name are required.", variant: "destructive" });
      return;
    }

    const studentData: Student = {
      id: currentStudent ? currentStudent.id : studentIdInput.trim(), // Keep original ID if editing, or use input (ensure ID is not editable for existing)
      name: studentNameInput.trim(),
      status: studentStatusInput,
    };

    if (currentStudent) {
      updateStudent(studentData);
      toast({ title: "Student Updated", description: "The student's details have been updated." });
    } else {
      // Check for duplicate ID before adding
      if (students.find(s => s.id === studentIdInput.trim())) {
        toast({ title: "Error", description: "A student with this ID already exists.", variant: "destructive" });
        return;
      }
      addStudent(studentData);
      toast({ title: "Student Added", description: "The new student has been added to the list." });
    }
    setIsFormOpen(false);
    resetFormFields();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedStudents = JSON.parse(e.target?.result as string) as Student[];
          // Basic validation (check if it's an array)
          if (!Array.isArray(importedStudents)) {
            throw new Error("Imported file is not a valid JSON array.");
          }
          // Further validation could check for required student properties
          importedStudents.forEach(s => {
            if (!s.id || !s.name || !s.status) throw new Error("Imported student data is missing required fields.");
            if (!studentStatuses.includes(s.status)) throw new Error(`Invalid status "${s.status}" for student ${s.id}.`);
          });

          setGlobalStudents(importedStudents); // Replace current students with imported ones
          toast({ title: "Import Successful", description: `${importedStudents.length} students imported.` });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to parse JSON file.";
          toast({ title: "Import Failed", description: errorMessage, variant: "destructive" });
        }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset file input
    }
  };


  const getStatusVariant = (status: Student['status']) => {
    switch (status) {
      case 'Eligible': return 'default';
      case 'Voted': return 'secondary';
      case 'Ineligible': return 'destructive';
      default: return 'outline';
    }
  };

  if (!isMounted) {
    // Skeleton or loading state
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center"><ClipboardList className="mr-3 text-primary" size={32} />Manage Students</h1>
          <Button variant="outline" asChild><Link href={ROUTES.ADMIN_DASHBOARD}><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link></Button>
        </div>
        <Card className="shadow-lg"><CardHeader><CardTitle>Student Data Management</CardTitle><CardDescription>Loading student data...</CardDescription></CardHeader><CardContent><div className="animate-pulse"><div className="h-8 bg-muted rounded w-1/4 mb-4"></div><div className="h-10 bg-muted rounded w-full mb-2"></div><div className="h-10 bg-muted rounded w-full"></div></div></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <ClipboardList className="mr-3 text-primary" size={32} />
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
          <CardDescription>View, add, edit, delete, and import student information. Imported data replaces the current list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mt-4">
            <Upload className="h-4 w-4" />
            <AlertTitle>JSON Import</AlertTitle>
            <AlertDescription>
              Import student data from a JSON file. The file should be an array of student objects, each with `id`, `name`, and `status` ('Eligible', 'Voted', 'Ineligible'). For a real application, Excel import would be more robust.
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileImport} style={{ display: 'none' }} />
            <Button onClick={handleImportClick} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Students (JSON)
            </Button>
            <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) resetFormFields(); }}>
              <DialogTrigger asChild>
                <Button onClick={handleAddStudentClick}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{currentStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitForm} className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="studentIdInput">Student ID</Label>
                    <Input id="studentIdInput" value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)} placeholder="e.g., S1005" required disabled={!!currentStudent} />
                    {!!currentStudent && <p className="text-xs text-muted-foreground">Student ID cannot be changed for existing students.</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="studentNameInput">Full Name</Label>
                    <Input id="studentNameInput" value={studentNameInput} onChange={(e) => setStudentNameInput(e.target.value)} placeholder="e.g., Eva Green" required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="studentStatusInput">Status</Label>
                    <Select value={studentStatusInput} onValueChange={(value: Student['status']) => setStudentStatusInput(value)} required>
                      <SelectTrigger id="studentStatusInput">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" /> {currentStudent ? 'Save Changes' : 'Create Student'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students ({students.length})</CardTitle>
          <CardDescription>This list is managed in the current session.</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(student.status)}>{student.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditStudentClick(student)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete" className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the student &quot;{student.name}&quot; ({student.id}).</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteStudentConfirmed(student.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No students found. Add one or import a list.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
