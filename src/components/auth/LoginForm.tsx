'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { USER_ROLES, ROUTES, type UserRole } from '@/lib/constants';
import { LogIn, UserCog, User } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setRole: setGlobalRole } = useAppState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(USER_ROLES.STUDENT);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === USER_ROLES.ADMIN && username === 'admin' && password === 'adminpass') {
        toast({ title: 'Login Successful', description: 'Redirecting to Admin Dashboard...' });
        setGlobalRole(USER_ROLES.ADMIN);
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else if (selectedRole === USER_ROLES.STUDENT && username === 'student' && password === 'studentpass') {
        toast({ title: 'Login Successful', description: 'Redirecting to Student Verification...' });
        setGlobalRole(USER_ROLES.STUDENT);
        router.push(ROUTES.STUDENT_VERIFY);
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials or role selection.',
          variant: 'destructive',
        });
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="role" className="text-sm font-medium">Select Your Role</Label>
        <RadioGroup
          defaultValue={USER_ROLES.STUDENT}
          onValueChange={(value: UserRole) => setSelectedRole(value)}
          className="mt-2 grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value={USER_ROLES.STUDENT} id="role-student" className="peer sr-only" />
            <Label
              htmlFor="role-student"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <User className="mb-2 h-6 w-6" />
              Student
            </Label>
          </div>
          <div>
            <RadioGroupItem value={USER_ROLES.ADMIN} id="role-admin" className="peer sr-only" />
            <Label
              htmlFor="role-admin"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <UserCog className="mb-2 h-6 w-6" />
              Admin
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={selectedRole === USER_ROLES.ADMIN ? "admin" : "student"}
          required
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={selectedRole === USER_ROLES.ADMIN ? "adminpass" : "studentpass"}
          required
          className="bg-background"
        />
         <p className="text-xs text-muted-foreground">
          Hint: Use '{selectedRole === USER_ROLES.ADMIN ? "admin/adminpass" : "student/studentpass"}'
        </p>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
        {isLoading ? 'Logging in...' : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </>
        )}
      </Button>
    </form>
  );
}
