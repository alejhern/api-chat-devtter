import { z } from "zod";

const langs = [
  "javascript",
  "typescript",
  "html",
  "python",
  "java",
  "bash",
  "c",
  "cpp",
  "ruby",
  "php",
];

const messageSchema = z
  .object({
    sender: z.string(),
    receiver: z.string(),
    content: z.string().min(1).optional(),
    code: z
      .object({
        language: z.enum(langs),
        content: z.string().min(1),
      })
      .optional(),
  })
  .refine((data) => data.content || data.code, {
    message: "Message must have content or code",
  });

export function validateMessage(data) {
  return messageSchema.safeParse(data);
}
