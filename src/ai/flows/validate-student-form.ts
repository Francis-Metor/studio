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
  prompt: `You are an expert AI form validator. Your primary task for this request is to validate the provided Student ID and Full Name.

1.  **Student ID Validation (Output: \`isValidStudentId\`)**:
    *   A valid student ID should appear to be a unique identifier.
    *   It should not be overly generic (e.g., "id", "student" are not good, but "student123" or "S12345" might be okay).
    *   It should not be excessively short (e.g., 1 character) or consist purely of symbols.
    *   Set \`isValidStudentId\` to \`true\` if it meets these criteria, \`false\` otherwise.

2.  **Name Validation (Output: \`isValidName\`)**:
    *   A valid name should look like a real person's full name.
    *   It should typically consist of at least two words.
    *   It should primarily contain letters.
    *   Set \`isValidName\` to \`true\` if it meets these criteria, \`false\` otherwise.

The \`category\` and \`candidate\` fields are provided but are NOT the focus of this specific validation step. You should still set \`isValidCategory\` and \`isValidCandidate\` based on their content (e.g., to \`false\` if they are empty or not applicable, or \`true\` if you deem them valid). However, the critical outputs for student verification are \`isValidStudentId\` and \`isValidName\`.

**Feedback (Output: \`feedback\`)**:
Provide a concise feedback message.
*   If both \`studentId\` and \`name\` are valid, the feedback should be positive (e.g., "Student ID and Name appear valid.").
*   If either \`studentId\` or \`name\` (or both) are invalid, the feedback should clearly state which field(s) are problematic and a brief reason (e.g., "Student ID is too generic. Name appears valid." or "Name seems too short. Student ID is invalid.").

Input Data:
Student ID: {{{studentId}}}
Name: {{{name}}}
Category: {{{category}}}
Candidate: {{{candidate}}}

Ensure all boolean fields in the output schema (\`isValidStudentId\`, \`isValidName\`, \`isValidCategory\`, \`isValidCandidate\`) are set.
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

