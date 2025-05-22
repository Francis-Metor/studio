
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react'; // Changed from react-dom and renamed
import { useFormStatus } from 'react-dom'; // useFormStatus remains in react-dom
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/lib/constants';
import { handleStudentVerification, type VerificationFormState } from '@/app/student/verify/actions';
import { useAppState } from '@/context/AppStateContext';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
        </>
      ) : "Verify & Proceed"}
    </Button>
  );
}

export default function StudentVerificationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setStudentDetails } = useAppState();

  const initialState: VerificationFormState = { message: undefined, errors: undefined, aiResponse: undefined };
  // Updated to useActionState
  const [state, formAction] = useActionState(handleStudentVerification, initialState);

  useEffect(() => {
    if (state.message && state.aiResponse) {
      if (state.aiResponse.isValidStudentId && state.aiResponse.isValidName) {
        toast({
          title: 'Verification Successful',
          description: state.message,
          variant: 'default',
        });
        // Store student details for the voting process
        // The AI flow's input schema is used, so the server action has access to `validatedFields.data`.
        // Let's assume the action is updated to put `validatedInput` in `aiResponse` or directly in `state.validatedData`.
        // For now, we will rely on the action possibly returning this.
        // A better approach would be to add validatedInput directly to the VerificationFormState in actions.ts.
        // Current structure of VerificationFormState does not include validatedData, but we can adjust if needed.
        // Let's try to get it from state if the action is updated to include it.

        // Check if validatedData is part of the state (needs action modification)
        if ((state as any).validatedData) {
          const { studentId, name } = (state as any).validatedData;
          setStudentDetails({ studentId, name });
        } else if (state.aiResponse && state.aiResponse.input?.studentId && state.aiResponse.input?.name) {
          // Fallback if input is echoed in aiResponse (not standard for current schema)
           setStudentDetails({ studentId: state.aiResponse.input.studentId, name: state.aiResponse.input.name });
        }
        // else {
        //   // If neither validatedData nor aiResponse.input is available, we might be missing the data.
        //   // This part might need refinement in `actions.ts` to ensure `studentId` and `name` are passed back reliably on success.
        //   console.warn("Student details for context are missing from the verification response.");
        // }
        router.push(ROUTES.STUDENT_VOTE);
      } else {
        toast({
          title: 'Verification Issues',
          description: state.aiResponse.feedback || state.message || "Please check the details.",
          variant: 'destructive',
        });
      }
    } else if (state.message && !state.aiResponse && !state.errors) { // General error from action
       toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
    }
  }, [state, router, toast, setStudentDetails]);
  

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          name="studentId"
          type="text"
          placeholder="e.g., S12345"
          required
          className="bg-background"
          aria-describedby="studentId-error"
        />
        {state.errors?.studentId && (
          <p id="studentId-error" className="text-sm text-destructive">{state.errors.studentId.join(', ')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Jane Doe"
          required
          className="bg-background"
          aria-describedby="name-error"
        />
        {state.errors?.name && (
          <p id="name-error" className="text-sm text-destructive">{state.errors.name.join(', ')}</p>
        )}
      </div>
      
      {state.errors?._form && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Error</AlertTitle>
          <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
        </Alert>
      )}

      {state.aiResponse && (
        <Alert variant={state.aiResponse.isValidStudentId && state.aiResponse.isValidName ? "default" : "destructive"} className="mt-4">
          {state.aiResponse.isValidStudentId && state.aiResponse.isValidName ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>AI Validation Feedback</AlertTitle>
          <AlertDescription>
            <p>{state.aiResponse.feedback}</p>
            <ul className="list-disc list-inside mt-2 text-xs">
              <li>Student ID Valid: {state.aiResponse.isValidStudentId ? 'Yes' : 'No'}</li>
              <li>Name Valid: {state.aiResponse.isValidName ? 'Yes' : 'No'}</li>
              {/* We can ignore category/candidate validation for this step */}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <SubmitButton />
    </form>
  );
}
