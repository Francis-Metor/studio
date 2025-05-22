
// src/ai/flows/validate-student-form.ts
'use server';
/**
 * @fileOverview Student form validation (NOW LOCAL - NOT AI DRIVEN FOR VERIFICATION).
 * This flow is kept for structural integrity but the core student verification
 * logic has been moved to src/app/student/verify/actions.ts for offline use.
 *
 * - validateStudentForm - A function that handles the student form validation process.
 * - ValidateStudentFormInput - The input type for the validateStudentForm function.
 * - ValidateStudentFormOutput - The return type for the validateStudentForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Student type might not be needed here anymore if not used in schemas
// import type { Student } from '@/lib/types';

// Simplified Input: The local action now handles loading registeredStudents
const ValidateStudentFormInputSchema = z.object({
  studentId: z.string().describe('The student ID entered by the user.'),
  name: z.string().describe('The full name entered by the student.'),
});
export type ValidateStudentFormInput = z.infer<typeof ValidateStudentFormInputSchema>;

// Simplified Output: Reflects basic validation, actual detailed logic is in actions.ts
const ValidateStudentFormOutputSchema = z.object({
  isStudentIdFound: z.boolean().describe('Indicates if student ID was processed (not necessarily found in a list by this flow anymore).'),
  isNameMatch: z.boolean().describe('Indicates if name was processed (not necessarily matched by this flow anymore).'),
  isEligible: z.boolean().describe('Indicates if eligibility was processed (not necessarily determined by this flow anymore).'),
  overallValidation: z.boolean().describe('Overall outcome of this flow\'s processing (simplified).'),
  feedback: z.string().describe('Generic feedback message from this flow.'),
  verifiedStudentName: z.string().optional().describe('The name of the student if processed.'),
  verifiedStudentStatus: z.string().optional().describe('The status of the student if processed.')
});
export type ValidateStudentFormOutput = z.infer<typeof ValidateStudentFormOutputSchema>;

// This function will now be a simple passthrough if called,
// as primary validation logic is in src/app/student/verify/actions.ts
export async function validateStudentForm(input: ValidateStudentFormInput): Promise<ValidateStudentFormOutput> {
  // console.warn("validateStudentForm AI flow called, but primary validation is now local in actions.ts");
  // Return a generic successful-looking response since this flow is bypassed for actual validation logic
  return {
    isStudentIdFound: true,
    isNameMatch: true,
    isEligible: true,
    overallValidation: true,
    feedback: "Student data processed (local validation applies).",
    verifiedStudentName: input.name,
    verifiedStudentStatus: "Eligible (local validation applies)",
  };
}

// The Genkit prompt and flow definitions below are largely vestigial for this specific use case
// but are kept to avoid breaking `genkit:dev` if it scans for all `ai.defineFlow` etc.
// They won't be effectively used by the student verification page.

const prompt = ai.definePrompt({
  name: 'validateStudentAgainstListPrompt_DEPRECATED_FOR_LOCAL',
  input: {schema: ValidateStudentFormInputSchema},
  output: {schema: ValidateStudentFormOutputSchema},
  prompt: `This is a placeholder prompt. Student verification logic is now handled locally.
  If this prompt is invoked, it indicates an unexpected call path.
  Input Student ID: {{{studentId}}}
  Input Full Name: {{{name}}}
  Return a generic success response.`,
});

const validateStudentFormFlow = ai.defineFlow(
  {
    name: 'validateStudentFormFlow_DEPRECATED_FOR_LOCAL',
    inputSchema: ValidateStudentFormInputSchema,
    outputSchema: ValidateStudentFormOutputSchema,
  },
  async (input: ValidateStudentFormInput) => {
    // const {output} = await prompt(input); // Bypassing actual AI call
    // return output!;
    return { // Directly return the simplified success structure
        isStudentIdFound: true,
        isNameMatch: true,
        isEligible: true,
        overallValidation: true,
        feedback: "Student data processed by vestigial flow (local validation applies).",
        verifiedStudentName: input.name,
        verifiedStudentStatus: "Eligible (local validation applies)",
    };
  }
);

