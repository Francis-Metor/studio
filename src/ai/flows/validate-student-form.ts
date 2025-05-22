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
  prompt: `You are an expert AI form validator.

You will use the information provided to validate the student form, and provide feedback on any issues it has.

Student ID: {{{studentId}}}
Name: {{{name}}}
Category: {{{category}}}
Candidate: {{{candidate}}}

Determine if the student ID, name, category, and candidate are valid. Provide feedback on each field, and set the corresponding output fields appropriately.
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
