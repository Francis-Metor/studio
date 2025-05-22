
// src/app/student/verify/actions.ts
'use server';

import { z } from 'zod';
import studentsData from '@/lib/students-data.json'; // Import student data
import type { Student } from '@/lib/types';

const VerificationFormSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
});

export interface VerificationFormState {
  errors?: {
    studentId?: string[];
    name?: string[];
    _form?: string[];
  };
  message?: string; // General message, potentially success or failure summary
  validatedData?: {
    studentId: string;
    name: string; // This should be the name from the student record
  };
}

export async function handleStudentVerification(
  prevState: VerificationFormState,
  formData: FormData
): Promise<VerificationFormState> {
  const validatedFields = VerificationFormSchema.safeParse({
    studentId: formData.get('studentId'),
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed due to input errors. Please check your inputs.",
    };
  }

  const { studentId, name } = validatedFields.data;
  const registeredStudents: Student[] = studentsData as Student[];

  const foundStudent = registeredStudents.find(s => s.id === studentId);

  if (!foundStudent) {
    return {
      message: "Student ID not found in the system.",
      errors: { _form: ["Student ID not found in the system."] }
    };
  }

  // Case-insensitive name comparison
  if (foundStudent.name.toLowerCase() !== name.toLowerCase()) {
    return {
      message: "Student ID found, but the provided name does not match our records.",
      errors: { _form: ["Student ID found, but the provided name does not match our records. Please check your full name."] }
    };
  }

  if (foundStudent.status !== 'Eligible') {
    let feedbackMessage = `Student ID and name match, but this student is not currently eligible to vote. Status: ${foundStudent.status}.`;
    if (foundStudent.status === 'Voted') {
        feedbackMessage = "This student has already voted.";
    } else if (foundStudent.status === 'Ineligible') {
        feedbackMessage = "This student is marked as ineligible to vote.";
    }
    return {
      message: feedbackMessage,
      errors: { _form: [feedbackMessage] }
    };
  }

  // All checks passed
  return {
    message: "Verification successful. Proceed to vote.",
    validatedData: {
      studentId: foundStudent.id,
      name: foundStudent.name, // Use the official name from records
    }
  };
}
