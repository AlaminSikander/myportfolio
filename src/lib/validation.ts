import { z } from "zod";

export const contactLimits = {
  name: 80,
  email: 254,
  subject: 140,
  message: 4000,
  minMessage: 20,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(contactLimits.name, `Name must be ${contactLimits.name} characters or fewer.`),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(contactLimits.email, "Email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  subject: z
    .string()
    .trim()
    .min(3, "Please add a short subject.")
    .max(contactLimits.subject, `Subject must be ${contactLimits.subject} characters or fewer.`),
  message: z
    .string()
    .trim()
    .min(contactLimits.minMessage, `Please write at least ${contactLimits.minMessage} characters.`)
    .max(contactLimits.message, `Message must be ${contactLimits.message} characters or fewer.`),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export const contactRequestSchema = contactSchema.extend({
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().nonnegative(),
});

export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field in contactSchema.shape && !errors[field as ContactField]) {
      errors[field as ContactField] = issue.message;
    }
  }
  return errors;
}
