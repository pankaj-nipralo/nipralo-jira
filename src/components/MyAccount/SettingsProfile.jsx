"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
});

const SettingsProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar || "/images/default-avatar.png"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username || "",
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("name", values.name);
    formData.append("email", values.email); // optional if read-only

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    // Simulate upload
    setTimeout(() => {
      setLoading(false);
      // console.log("FormData:", values, selectedFile);
      toast.success("Profile updated successfully (simulated)");
    }, 1000);
  };

  return (
    <section className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md border">
      <div className="flex flex-col items-center gap-1">
        {/* Avatar upload */}
        <label
          htmlFor="avatarInput"
          className="cursor-pointer relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200"
        >
          <Image
            src={avatarPreview}
            alt="User Avatar"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 w-full text-center text-xs bg-black bg-opacity-50 text-white py-1">
            Edit
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
            className="hidden"
            id="avatarInput"
          />
        </label>

        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
        <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
          {user.role}
        </span>
      </div>

      {/* Form Section */}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 mt-8"
          >
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your username"
                      {...field}
                      className="!h-[48px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="!h-[48px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (disabled) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      className="!h-[48px] !cursor-not-allowed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button disabled={loading} type="submit" className="w-full">
              {loading && <Loader className="animate-spin mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </section>
  );
};

export default SettingsProfile;
