// src/ai/flows/validate-student-form.ts
'use server';
/**
 * @fileOverview A student form validation AI agent.
 *
 * - validateStudentForm - A function that handles the student form validation process.
 * - ValidateStudentFormInput - The input type for the validateStudentForm function.
 * - ValidateStudentFormOutput - The return type for the validateStudentForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateStudentFormInputSchema = z.object({
  studentId: z.string().describe('The student ID to validate.'),
  name: z.string().describe('The name of the student.'),
  category: z.string().describe('The voting category selected.'),
  candidate: z.string().describe('The candidate selected.'),
});
export type ValidateStudentFormInput = z.infer<typeof ValidateStudentFormInputSchema>;

const ValidateStudentFormOutputSchema = z.object({
  isValidStudentId: z.boolean().describe('Whether the student ID is valid or not.'),
  isValidName: z.boolean().describe('Whether the name is valid or not.'),
  isValidCategory: z.boolean().describe('Whether the voting category is valid or not.'),
  isValidCandidate: z.boolean().describe('Whether the candidate is valid or not.'),
  feedback: z.string().describe('Feedback on the form, including any errors or warnings.'),
});
export type ValidateStudentFormOutput = z.infer<typeof ValidateStudentFormOutputSchema>;

export async function validateStudentForm(input: ValidateStudentFormInput): Promise<ValidateStudentFormOutput> {
  return validateStudentFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateStudentFormPrompt',
  input: {schema: ValidateStudentFormInputSchema},
  output: {schema: ValidateStudentFormOutputSchema},
  prompt: `You are an AI form validator assisting with a student voting application. For this student VERIFICATION step, your primary goal is to allow a user to proceed with testing if they provide plausible, non-empty inputs for Student ID and Full Name.

1.  **Student ID Validation (Output: \`isValidStudentId\`)**:
    *   Consider the Student ID VALID if it is not empty and contains at least one alphanumeric character. Examples: "S12345", "test001", "A1".
    *   Set \`isValidStudentId\` to \`true\` if it meets these criteria, \`false\` otherwise.

2.  **Name Validation (Output: \`isValidName\`)**:
    *   Consider the Full Name VALID if it is not empty and appears to be a name (e.g., contains at least one space, suggesting multiple words, primarily letters). Examples: "Test User", "Jane Doe", "Student Name".
    *   Set \`isValidName\` to \`true\` if it meets these criteria, \`false\` otherwise.

3.  **Category and Candidate Validation (Outputs: \`isValidCategory\`, \`isValidCandidate\`)**:
    *   For this initial verification step, the user has not yet selected a category or candidate.
    *   Therefore, set \`isValidCategory\` to \`true\` and \`isValidCandidate\` to \`true\` as these fields are not being actively validated at this stage.

**Feedback (Output: \`feedback\`)**:
*   If both \`studentId\` and \`name\` are considered valid by the lenient criteria above, provide positive feedback: "Student ID and Name look good for proceeding."
*   If \`studentId\` is invalid (e.g., empty), feedback should be: "Student ID is required."
*   If \`name\` is invalid (e.g., empty), feedback should be: "Full Name is required."
*   If both are invalid, combine feedback: "Student ID and Full Name are required."

Input Data:
Student ID: {{{studentId}}}
Name: {{{name}}}
Category: {{{category}}}
Candidate: {{{candidate}}}

Ensure all boolean fields in the output schema (\`isValidStudentId\`, \`isValidName\`, \`isValidCategory\`, \`isValidCandidate\`) are set according to these lenient verification guidelines.
`,
});

const validateStudentFormFlow = ai.defineFlow(
  {
    name: 'validateStudentFormFlow',
    inputSchema: ValidateStudentFormInputSchema,
    outputSchema: ValidateStudentFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
