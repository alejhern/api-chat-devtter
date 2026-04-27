import z from "zod";

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

const messageSchema = z.object({
  sender: z.string(),
  receiver: z.string(),
  content: z.string(),
  code: z
    .object({
      language: z.enum(langs),
      content: z.string(),
    })
    .optional(),
});

export function validateMessage(data) {
  try {
    return messageSchema.parse(data);
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
}
