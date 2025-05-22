import StudentVerificationForm from '@/components/student/StudentVerificationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Fingerprint } from 'lucide-react';

export default function StudentVerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Fingerprint size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Student Verification</CardTitle>
          <CardDescription>Please enter your details to proceed to voting.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentVerificationForm />
        </CardContent>
      </Card>
    </div>
  );
}
