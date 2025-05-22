
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
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
    if (state.validatedData) { // Successful verification
      toast({
        title: 'Verification Successful',
        description: state.message || "You can now proceed to vote.",
        variant: 'default',
      });
      setStudentDetails({
        studentId: state.validatedData.studentId,
        name: state.validatedData.name
      });
      router.push(ROUTES.STUDENT_VOTE);
    } else if (state.message && state.errors?._form) { // Form-level error from local validation
      // The Alert component below will display this message, no separate toast needed.
    } else if (state.message && !state.errors) { // General message without specific errors (e.g. Zod parse fail)
        toast({
          title: 'Verification Info',
          description: state.message,
          variant: 'destructive',
        });
    }
    // Zod errors (state.errors.studentId / state.errors.name) are handled by inline messages.
  }, [state, router, toast, setStudentDetails]);

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

      {/* Display general form errors (e.g., from local validation or Zod parse fail message) */}
      {state.errors?._form && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Error</AlertTitle>
          <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
        </Alert>
      )}

      {/* Display success message before redirect (optional, redirect is usually fast) */}
      {state.validatedData && state.message && (
        <Alert variant="default" className="mt-4 border-green-500">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Verification Success</AlertTitle>
          <AlertDescription>
            {state.message} Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <SubmitButton />

       <Alert variant="default" className="mt-6 text-sm">
          <Info className="h-4 w-4" />
          <AlertTitle>Test Credentials (from students-data.json)</AlertTitle>
          <AlertDescription>
            Try ID: <strong>S1001</strong>, Name: <strong>Alice Johnson</strong> (Eligible) <br />
            Try ID: <strong>S1002</strong>, Name: <strong>Bob Williams</strong> (Eligible) <br />
            Try ID: <strong>S1003</strong>, Name: <strong>Carol Brown</strong> (Voted - Not Eligible) <br />
            Try ID: <strong>S1004</strong>, Name: <strong>David Lee</strong> (Ineligible) <br />
            Try ID: <strong>student</strong>, Name: <strong>Test Student</strong> (Eligible) <br/>
            Try ID: <strong>S9999</strong>, Name: <strong>Non Existent</strong> (ID not found) <br />
            Try ID: <strong>S1001</strong>, Name: <strong>Wrong Name</strong> (Name mismatch)
          </AlertDescription>
        </Alert>
    </form>
  );
}
