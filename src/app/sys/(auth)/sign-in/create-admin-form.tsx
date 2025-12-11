"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-utils/auth-client";
import { PATH } from "@/lib/path";

import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { USER_ROLES } from "@/lib/db/schema/auth-schema";

const createAdminSchema = z
  .object({
    email: z.email({ message: "Please enter a valid email" }),
    name: z.string().min(2, { message: "Name is required" }).max(16, {
      message: "Name must be minimum 2 characters and maximum 16 characters",
    }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateAdminValues = z.infer<typeof createAdminSchema>;

export function CreateAdminForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<CreateAdminValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ email, password, name }: CreateAdminValues) {
    setError(null);
    setLoading(true);

    toast.loading("Creating admin...");

    try {
      const response = await authClient.signUp.email({
        email,
        password,
        name,
        role: USER_ROLES.SUPERADMIN,
      });
      if (!response.error) {
        toast.success("Admin created successfully");
        router.push(PATH.SIGNIN);
      } else {
        setError(response.error.message || "Failed to create admin");
        toast.error(response.error.message || "Failed to create admin");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Failed to create admin");
        toast.error("Failed to create admin");
      }
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Create Admin Account
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          No admin detected, please create an account to add and manage users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
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
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Confirm Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <LoadingButton
              type="submit"
              className="w-full cursor-pointer mt-4 "
              loading={loading}
            >
              Create Admin
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
