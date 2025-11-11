import { z } from "zod";

export const ClaimPeriodSchema = z
	.object({
		startDate: z
			.string()
			.min(1, "Start date is required")
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
		endDate: z
			.string()
			.min(1, "End date is required")
			.regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
	})
	.refine((data) => new Date(data.startDate) < new Date(data.endDate), {
		message: "Start date must be before end date",
		path: ["endDate"],
	});

export const CreateClaimFormSchema = z.object({
	companyName: z
		.string()
		.min(1, "Company name is required")
		.max(200, "Company name must be at most 200 characters"),
	claimPeriod: ClaimPeriodSchema,
	amount: z
		.number("Amount must be a number")
		.int("Amount must be an integer (pence)")
		.positive("Amount must be positive"),
	projectIds: z.array(z.string()).optional(),
});

export const CreateProjectFormSchema = z.object({
	name: z
		.string()
		.min(1, "Project name is required")
		.max(200, "Project name must be at most 200 characters"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(1000, "Description must be at most 1000 characters"),
});
