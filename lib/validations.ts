import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
    images: z.array(z.string().min(1, "Image data cannot be empty")).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
