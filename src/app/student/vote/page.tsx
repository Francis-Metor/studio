import VotingArea from '@/components/student/VotingArea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VoteIcon } from 'lucide-react'; // Vote is a type, VoteIcon is the component

export default function StudentVotePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <VoteIcon size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Cast Your Vote</CardTitle>
          <CardDescription>Select your preferred candidate for each position.</CardDescription>
        </CardHeader>
        <CardContent>
          <VotingArea />
        </CardContent>
      </Card>
    </div>
  );
}
