
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; 
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

  const initialState: VerificationFormState = { message: undefined, errors: undefined, aiResponse: undefined, validatedData: undefined };
  const [state, formAction] = useActionState(handleStudentVerification, initialState);

  useEffect(() => {
    if (state.message && state.aiResponse) { // AI response is present
      if (state.aiResponse.isValidStudentId && state.aiResponse.isValidName) { // AI says it's valid
        toast({
          title: 'Verification Successful',
          description: state.message, // "Verification successful. Redirecting to vote..."
          variant: 'default',
        });
        
        // Student details are passed back in `state.validatedData` on success
        if (state.validatedData) {
          const { studentId, name } = state.validatedData;
          setStudentDetails({ studentId, name });
        } else {
          // This case should ideally not be hit if action.ts is correctly populating validatedData on success
          console.warn("Student details for context are missing from the successful verification response.");
        }
        router.push(ROUTES.STUDENT_VOTE);
      } else { // AI says it's invalid
        toast({
          title: 'Verification Issues',
          description: state.aiResponse.feedback || state.message || "Please check the details.",
          variant: 'destructive',
        });
      }
    } else if (state.message && !state.aiResponse && !state.errors) { // General error from action (e.g. caught exception before AI response)
       toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
    }
    // Note: Zod errors (state.errors.studentId / state.errors.name) are handled by inline messages.
    // Form-level errors (state.errors._form) from AI are handled by the Alert component below.
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

      {state.aiResponse && !(state.aiResponse.isValidStudentId && state.aiResponse.isValidName) && state.aiResponse.feedback && !state.errors?._form && (
        // This alert shows AI feedback if it's an AI validation failure but not already shown by errors._form
        // Useful if errors._form is not populated but AI still had feedback on invalid fields.
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>AI Validation Feedback</AlertTitle>
          <AlertDescription>
            <p>{state.aiResponse.feedback}</p>
            <ul className="list-disc list-inside mt-2 text-xs">
              <li>Student ID Valid: {state.aiResponse.isValidStudentId ? 'Yes' : 'No'}</li>
              <li>Name Valid: {state.aiResponse.isValidName ? 'Yes' : 'No'}</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <SubmitButton />
    </form>
  );
}

