"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Enter a valid email").min(1, {
    message: "Email is required",
  }),
});

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values) => {
    setLoading(true);
    // // console.log("Password reset request for:", values.email);

    // Simulate sending reset link
    setTimeout(() => {
      setLoading(false);
      toast.success("Reset link sent to your email (simulated)");
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10  rounded-3xl">
      <div className="flex w-full sm:w-[80%] md:w-[300px] lg:w-[400px] min-w-[250px] flex-shrink-0 space-y-4 flex-col gap-6 rounded-3xl">
    
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.error("Validation error:", errors);
                  toast.error("Please enter a valid email address");
                })}
              >
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            className="!h-[48px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={loading} type="submit" className="w-full">
                    {loading && (
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                    )}
                    Send Reset Link
                  </Button>
                  <div className="text-center text-sm">
                    Back to{" "}
                    <Link
                      href="/login"
                      className="underline underline-offset-4"
                    >
                      Sign in
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
};

export default ForgetPassword;
