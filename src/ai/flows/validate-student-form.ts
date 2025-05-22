
// src/ai/flows/validate-student-form.ts
'use server';
/**
 * @fileOverview A student form validation AI agent that checks against a registered student list.
 *
 * - validateStudentForm - A function that handles the student form validation process.
 * - ValidateStudentFormInput - The input type for the validateStudentForm function.
 * - ValidateStudentFormOutput - The return type for the validateStudentForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Student } from '@/lib/types'; // Import Student type

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['Eligible', 'Voted', 'Ineligible']),
});

const ValidateStudentFormInputSchema = z.object({
  studentId: z.string().describe('The student ID entered by the user for validation.'),
  name: z.string().describe('The full name entered by the student for validation.'),
  registeredStudents: z.array(StudentSchema).describe('A list of registered student objects, each with id, name, and status.'),
});
export type ValidateStudentFormInput = z.infer<typeof ValidateStudentFormInputSchema>;

const ValidateStudentFormOutputSchema = z.object({
  isStudentIdFound: z.boolean().describe('True if the input studentId matches an id in registeredStudents.'),
  isNameMatch: z.boolean().describe('True if studentId was found AND the input name (case-insensitive) matches the name of the found student.'),
  isEligible: z.boolean().describe('True if studentId was found, name matched, AND the status of the found student is "Eligible".'),
  overallValidation: z.boolean().describe('True ONLY IF isStudentIdFound, isNameMatch, AND isEligible are all true.'),
  feedback: z.string().describe('Detailed feedback message on the validation result.'),
  verifiedStudentName: z.string().optional().describe('The official name of the student if verification is successful.'),
  verifiedStudentStatus: z.string().optional().describe('The status of the student if verification is successful.')
});
export type ValidateStudentFormOutput = z.infer<typeof ValidateStudentFormOutputSchema>;

export async function validateStudentForm(input: ValidateStudentFormInput): Promise<ValidateStudentFormOutput> {
  return validateStudentFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateStudentAgainstListPrompt',
  input: {schema: ValidateStudentFormInputSchema},
  output: {schema: ValidateStudentFormOutputSchema},
  prompt: `You are an AI assistant that validates student verification details against a provided list of registered students.
Your task is to determine if the student is valid and eligible to vote based on the input studentId, name, and the list of registeredStudents.

Follow these steps STRICTLY:

1.  **Find Student by ID**:
    *   Look for a student in the \`registeredStudents\` array whose \`id\` EXACTLY matches the input \`studentId\`.
    *   If NO student is found with a matching \`id\`:
        Set \`isStudentIdFound\` to \`false\`.
        Set \`isNameMatch\` to \`false\`.
        Set \`isEligible\` to \`false\`.
        Set \`overallValidation\` to \`false\`.
        Set \`feedback\` to "Student ID not found in the system."
        STOP PROCESSING.
    *   If a student IS found (let's call them \`foundStudent\`):
        Set \`isStudentIdFound\` to \`true\`.
        Proceed to step 2.

2.  **Verify Name (if Student ID was found)**:
    *   Compare the input \`name\` (perform a case-insensitive comparison) with \`foundStudent.name\`.
    *   If the names DO NOT match (case-insensitively):
        Set \`isNameMatch\` to \`false\`.
        Set \`isEligible\` to \`false\` (as name mismatch implies incorrect identity for eligibility check).
        Set \`overallValidation\` to \`false\`.
        Set \`feedback\` to "Student ID found, but the provided name does not match our records. Please check your full name."
        STOP PROCESSING.
    *   If the names DO match (case-insensitively):
        Set \`isNameMatch\` to \`true\`.
        Proceed to step 3.

3.  **Check Eligibility Status (if Student ID and Name match)**:
    *   Examine \`foundStudent.status\`.
    *   If \`foundStudent.status\` is 'Eligible':
        Set \`isEligible\` to \`true\`.
        Set \`verifiedStudentName\` to \`foundStudent.name\`.
        Set \`verifiedStudentStatus\` to \`foundStudent.status\`.
        Proceed to step 4.
    *   If \`foundStudent.status\` is NOT 'Eligible' (e.g., 'Voted' or 'Ineligible'):
        Set \`isEligible\` to \`false\`.
        Set \`overallValidation\` to \`false\`.
        Set \`feedback\` to "Student ID and name match, but this student is not currently eligible to vote. Status: {{foundStudent.status}}."
        Set \`verifiedStudentName\` to \`foundStudent.name\`. // Still provide name for context
        Set \`verifiedStudentStatus\` to \`foundStudent.status\`.
        STOP PROCESSING.

4.  **Final Validation Outcome (if all previous checks determined validity and eligibility)**:
    *   If \`isStudentIdFound\` is \`true\`, \`isNameMatch\` is \`true\`, AND \`isEligible\` is \`true\`:
        Set \`overallValidation\` to \`true\`.
        Set \`feedback\` to "Verification successful. Proceed to vote."
        // verifiedStudentName and verifiedStudentStatus should already be set from step 3.

Input for validation:
Student ID: {{{studentId}}}
Full Name: {{{name}}}

List of Registered Students provided:
{{#if registeredStudents}}
{{#each registeredStudents}}
- ID: {{this.id}}, Name: {{this.name}}, Status: {{this.status}}
{{/each}}
{{else}}
- No registered students provided.
{{/if}}

Ensure all boolean fields (\`isStudentIdFound\`, \`isNameMatch\`, \`isEligible\`, \`overallValidation\`) and the \`feedback\`, \`verifiedStudentName\`, \`verifiedStudentStatus\` fields in the output schema are set STRICTLY according to these rules.
`,
});

const validateStudentFormFlow = ai.defineFlow(
  {
    name: 'validateStudentFormFlow',
    inputSchema: ValidateStudentFormInputSchema,
    outputSchema: ValidateStudentFormOutputSchema,
  },
  async (input: ValidateStudentFormInput) => {
    const {output} = await prompt(input);
    return output!;
  }
);
