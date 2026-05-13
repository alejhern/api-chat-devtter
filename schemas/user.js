import { z } from "zod";

const userSchema = z.object({
  id: z.string().min(1).max(10),
  userName: z.string().min(1).max(50),
  name: z.string().min(1).max(50),
  email: z.string().email().max(100),
  avatar: z.string().url().max(255).optional(),
});

export function validateUser(data) {
  return userSchema.safeParse(data);
}
