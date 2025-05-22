
// src/app/student/verify/actions.ts
'use server';

import { validateStudentForm, type ValidateStudentFormInput, type ValidateStudentFormOutput } from '@/ai/flows/validate-student-form';
import { z } from 'zod';
import studentsData from '@/lib/students-data.json'; // Import student data
import type { Student } from '@/lib/types';

const VerificationFormSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
});

export interface VerificationFormState {
  aiResponse?: ValidateStudentFormOutput;
  errors?: {
    studentId?: string[];
    name?: string[];
    _form?: string[];
  };
  message?: string; // General message, potentially success or failure summary
  validatedData?: { // Data to pass to app state if verification is successful
    studentId: string;
    name: string; // This should be the name from the student record
    // status?: string; // Could add status if needed by VotingArea later
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

  try {
    const aiInput: ValidateStudentFormInput = {
      studentId,
      name,
      registeredStudents,
    };

    const aiResponse = await validateStudentForm(aiInput);

    if (aiResponse.overallValidation) { // Use the new overallValidation field
      return {
        aiResponse,
        message: aiResponse.feedback || "Verification successful. Redirecting to vote...",
        validatedData: { 
          studentId: studentId, // Use the ID that was verified
          name: aiResponse.verifiedStudentName || name, // Prefer official name from AI
        }
      };
    } else {
      return {
        aiResponse,
        message: aiResponse.feedback || "Verification failed. Please check details.",
        errors: {
          _form: [aiResponse.feedback || "Student verification failed based on AI validation against the student roster."],
        }
      };
    }
  } catch (error) {
    console.error("Error during student verification AI call:", error);
    let errorMessage = "An unexpected error occurred during verification. Please try again.";
    if (error instanceof Error) {
        errorMessage = `Server error during AI validation: ${error.message}`;
    }
    return {
      message: errorMessage,
      errors: {
        _form: [errorMessage],
      }
    };
  }
}
