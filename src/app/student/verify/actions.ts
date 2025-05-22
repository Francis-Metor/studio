// src/app/student/verify/actions.ts
'use server';

import { validateStudentForm, type ValidateStudentFormInput, type ValidateStudentFormOutput } from '@/ai/flows/validate-student-form';
import { z } from 'zod';

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
  message?: string;
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
      message: "Validation failed. Please check your inputs.",
    };
  }

  const { studentId, name } = validatedFields.data;

  try {
    const aiInput: ValidateStudentFormInput = {
      studentId,
      name,
      category: '', // For verification, category and candidate are not yet selected
      candidate: '',
    };

    const aiResponse = await validateStudentForm(aiInput);

    if (aiResponse.isValidStudentId && aiResponse.isValidName) {
      return {
        aiResponse,
        message: "Verification successful. Redirecting to vote...",
      };
    } else {
      return {
        aiResponse,
        message: aiResponse.feedback || "Verification failed based on AI validation.",
        errors: {
          _form: [aiResponse.feedback || "AI validation failed."],
        }
      };
    }
  } catch (error) {
    console.error("Error during student verification AI call:", error);
    return {
      message: "An unexpected error occurred during verification. Please try again.",
      errors: {
        _form: ["Server error during AI validation."],
      }
    };
  }
}
