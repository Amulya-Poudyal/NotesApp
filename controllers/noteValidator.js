import { z } from 'zod';

// Define the schema for a note
export const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(1, "Content cannot be empty"),
});