import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
});

export const TaskSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  description: z.string().min(1, {
    message: "Description cannot be empty.",
  }),
  status: z.string(),
  priority: z.string(),
  category: z.string(),
  dueDate: z.date(),
});

export const PipelineSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
});
