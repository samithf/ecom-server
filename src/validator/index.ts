import { ObjectId } from "mongodb";
import { z } from "zod";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

enum Gender {
  Male = "Male",
  Female = "Female",
}

export const cafeSchema = z.object({
  name: z.string().min(6).max(10),
  description: z.string().min(1).max(256),
  location: z.string().min(1).max(255),
  logo: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
});

export const employeeSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email({ message: "Please provide a valid email" }),
  phone: z.string().regex(/^[89]\d{7}$/, {
    message: "Please provide a valid phone number (Starts with either 9 or 8 and have 8 digits)",
  }),
  cafeId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  }),
  gender: z.enum([Gender.Male, Gender.Female], { message: "Invalid selection" }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (format should be YYYY-MM-DD)" }),
});
