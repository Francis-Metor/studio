
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, ArrowLeft, Upload, UserPlus, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Student } from '@/lib/types';
import studentData from '@/lib/students-data.json'; // Import the student data
import { Badge } from '@/components/ui/badge';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch this data. For now, we use the imported JSON.
    setStudents(studentData as Student[]);
    setIsMounted(true);
  }, []);

  const getStatusVariant = (status: Student['status']) => {
    switch (status) {
      case 'Eligible': return 'default'; // default is primary
      case 'Voted': return 'secondary';
      case 'Ineligible': return 'destructive';
      default: return 'outline';
    }
  };

  if (!isMounted) {
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
            <CardDescription>Loading student data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
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
          <CardDescription>View student information. Student data is typically imported via Excel or managed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mt-4">
            <Upload className="h-4 w-4" />
            <AlertTitle>Excel Import & Full Management</AlertTitle>
            <AlertDescription>
              Full functionality to import student data from Excel files, add, edit, and delete students will be available in future updates. Currently, student data is read from a local JSON file for display and verification purposes.
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <Button disabled variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Students (Coming Soon)
            </Button>
            <Button disabled>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Student (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students ({students.length})</CardTitle>
          <CardDescription>This list is currently read-only from `students-data.json`.</CardDescription>
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
                      <Button variant="ghost" size="icon" title="Edit (Coming Soon)" disabled>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete (Coming Soon)" disabled className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No students found in the data source.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
