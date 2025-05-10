"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().trim().email("Invalid email").min(1, "Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Login successful (simulated)");
      router.push(returnUrl || "/nipralo-jira/workspace");
    }, 1000);
  };

  return (
    <div className="flex w-[320px] md:w-[400px] lg:w-[500px] flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 rounded-2xl">
      <div className="flex sm:w-[80%] md:w-[300px] lg:w-[400px] min-w-[200px] flex-shrink-0 space-y-4 flex-col gap-6 rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Email</CardDescription>
        </CardHeader>
        <Card>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute inset-y-0 right-2 cursor-pointer flex items-center text-muted-foreground hover:text-primary"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                        <Link
                          href="/reset-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline block mt-2"
                        >
                          Forgot your password?
                        </Link>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={loading} type="submit" className="w-full">
                    {loading && (
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                    )}
                    Login
                  </Button>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
