
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; 
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
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

  const initialState: VerificationFormState = {};
  const [state, formAction] = useActionState(handleStudentVerification, initialState);

  useEffect(() => {
    if (state.message && state.aiResponse) {
      if (state.aiResponse.overallValidation) { // Check the new overallValidation flag
        toast({
          title: 'Verification Successful',
          description: state.aiResponse.feedback || state.message,
          variant: 'default',
        });
        
        if (state.validatedData) {
          setStudentDetails({ 
            studentId: state.validatedData.studentId, 
            name: state.validatedData.name // Use the name from validatedData
          });
          router.push(ROUTES.STUDENT_VOTE);
        } else {
          console.warn("Student details for context are missing from the successful verification response.");
           toast({
            title: 'Context Error',
            description: "Verification seemed successful but student details could not be set for the session.",
            variant: 'destructive',
          });
        }
      } else { // AI validation failed (e.g., ID not found, name mismatch, not eligible)
        // No toast here, rely on the Alert component below for AI feedback
      }
    } else if (state.message && !state.aiResponse && !state.errors) { 
       toast({
          title: 'Verification Error',
          description: state.message,
          variant: 'destructive',
        });
    }
    // Zod errors (state.errors.studentId / state.errors.name) are handled by inline messages.
    // Form-level errors from AI (state.errors._form) or detailed AI feedback (state.aiResponse.feedback) are handled by the Alert component below.
  }, [state, router, toast, setStudentDetails]);
  
  const showAISuccessFeedback = state.aiResponse?.overallValidation && state.aiResponse.feedback;
  const showAIFailureFeedback = state.aiResponse && !state.aiResponse.overallValidation && state.aiResponse.feedback;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          name="studentId"
          type="text"
          placeholder="e.g., S1001"
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
          placeholder="e.g., Alice Johnson"
          required
          className="bg-background"
          aria-describedby="name-error"
        />
        {state.errors?.name && (
          <p id="name-error" className="text-sm text-destructive">{state.errors.name.join(', ')}</p>
        )}
      </div>
      
      {/* Display general form errors (e.g., from zod parse fail message or server error before AI) */}
      {state.errors?._form && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Error</AlertTitle>
          <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
        </Alert>
      )}

      {/* Display AI feedback if validation FAILED */}
      {showAIFailureFeedback && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Issue</AlertTitle>
          <AlertDescription>
            <p>{state.aiResponse!.feedback}</p>
            <ul className="list-disc list-inside mt-2 text-xs">
              <li>ID Found: {state.aiResponse!.isStudentIdFound ? 'Yes' : 'No'}</li>
              {state.aiResponse!.isStudentIdFound && <li>Name Match: {state.aiResponse!.isNameMatch ? 'Yes' : 'No'}</li>}
              {state.aiResponse!.isNameMatch && <li>Eligible: {state.aiResponse!.isEligible ? 'Yes' : 'No'}</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

       {/* Display AI feedback if validation SUCCEEDED (but before redirect, for clarity if needed) */}
      {showAISuccessFeedback && (
        <Alert variant="default" className="mt-4 border-green-500">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Verification Success</AlertTitle>
          <AlertDescription>
            {state.aiResponse!.feedback} Redirecting...
          </AlertDescription>
        </Alert>
      )}
      
      <SubmitButton />

       <Alert variant="default" className="mt-6 text-sm">
          <Info className="h-4 w-4" />
          <AlertTitle>Test Credentials</AlertTitle>
          <AlertDescription>
            Try ID: <strong>S1001</strong>, Name: <strong>Alice Johnson</strong> (Eligible) <br />
            Try ID: <strong>S1002</strong>, Name: <strong>Bob Williams</strong> (Eligible) <br />
            Try ID: <strong>S1003</strong>, Name: <strong>Carol Brown</strong> (Voted - Not Eligible) <br />
            Try ID: <strong>student</strong>, Name: <strong>Test Student</strong> (Eligible - for general login) <br/>
            Try ID: <strong>S9999</strong>, Name: <strong>Non Existent</strong> (ID not found) <br />
            Try ID: <strong>S1001</strong>, Name: <strong>Wrong Name</strong> (Name mismatch)
          </AlertDescription>
        </Alert>
    </form>
  );
}
