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
  prompt: `You are an AI form validator. Your ONLY task for student verification is to check if Student ID and Full Name are non-empty.

1.  **Student ID (\`studentId\`)**:
    *   If the \`studentId\` input is NOT empty, set \`isValidStudentId\` to \`true\`.
    *   If the \`studentId\` input IS empty, set \`isValidStudentId\` to \`false\`.

2.  **Full Name (\`name\`)**:
    *   If the \`name\` input is NOT empty, set \`isValidName\` to \`true\`.
    *   If the \`name\` input IS empty, set \`isValidName\` to \`false\`.

3.  **Category and Candidate**:
    *   Set \`isValidCategory\` to \`true\`. This field is not actively validated at this stage.
    *   Set \`isValidCandidate\` to \`true\`. This field is not actively validated at this stage.

**Feedback (\`feedback\`)**:
*   If \`isValidStudentId\` is \`true\` AND \`isValidName\` is \`true\`, set \`feedback\` to "Inputs accepted."
*   If \`isValidStudentId\` is \`false\` AND \`isValidName\` is \`true\`, set \`feedback\` to "Student ID is required."
*   If \`isValidStudentId\` is \`true\` AND \`isValidName\` is \`false\`, set \`feedback\` to "Full Name is required."
*   If \`isValidStudentId\` is \`false\` AND \`isValidName\` is \`false\`, set \`feedback\` to "Student ID and Full Name are required."

Input Data:
Student ID: {{{studentId}}}
Name: {{{name}}}
Category: {{{category}}}
Candidate: {{{candidate}}}

Ensure all boolean fields in the output schema (\`isValidStudentId\`, \`isValidName\`, \`isValidCategory\`, \`isValidCandidate\`) are set STRICTLY according to the non-empty checks stated above.
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

