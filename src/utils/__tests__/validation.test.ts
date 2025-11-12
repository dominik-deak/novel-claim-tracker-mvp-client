import { describe, expect, it } from "vitest";
import {
	ClaimPeriodSchema,
	CreateClaimFormSchema,
	CreateProjectFormSchema,
} from "../validation";

describe("Validation Schemas", () => {
	describe("ClaimPeriodSchema", () => {
		describe("Valid Inputs", () => {
			it("should accept valid date period", () => {
				const validPeriod = {
					startDate: "2024-01-01",
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(validPeriod);

				expect(result.success).toBe(true);
			});

			it("should accept dates one day apart", () => {
				const validPeriod = {
					startDate: "2024-01-01",
					endDate: "2024-01-02",
				};

				const result = ClaimPeriodSchema.safeParse(validPeriod);

				expect(result.success).toBe(true);
			});

			it("should accept dates spanning multiple years", () => {
				const validPeriod = {
					startDate: "2023-01-01",
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(validPeriod);

				expect(result.success).toBe(true);
			});

			it("should accept leap year dates", () => {
				const validPeriod = {
					startDate: "2024-02-29",
					endDate: "2024-03-01",
				};

				const result = ClaimPeriodSchema.safeParse(validPeriod);

				expect(result.success).toBe(true);
			});
		});

		describe("Date Format Validation", () => {
			it("should reject startDate with invalid format (DD/MM/YYYY)", () => {
				const invalidPeriod = {
					startDate: "01/01/2024",
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain(
						"Start date must be in YYYY-MM-DD format",
					);
				}
			});

			it("should reject endDate with invalid format", () => {
				const invalidPeriod = {
					startDate: "2024-01-01",
					endDate: "31-12-2024",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain(
						"End date must be in YYYY-MM-DD format",
					);
				}
			});

			it("should reject dates without leading zeros", () => {
				const invalidPeriod = {
					startDate: "2024-1-1",
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
			});

			it("should reject dates with time component", () => {
				const invalidPeriod = {
					startDate: "2024-01-01T00:00:00",
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
			});
		});

		describe("Required Field Validation", () => {
			it("should reject missing startDate", () => {
				const invalidPeriod = {
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
			});

			it("should reject empty startDate", () => {
				const invalidPeriod = {
					startDate: "",
					endDate: "2024-12-31",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Start date is required");
				}
			});

			it("should reject missing endDate", () => {
				const invalidPeriod = {
					startDate: "2024-01-01",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
			});

			it("should reject empty endDate", () => {
				const invalidPeriod = {
					startDate: "2024-01-01",
					endDate: "",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("End date is required");
				}
			});
		});

		describe("Date Order Validation (Custom Refinement)", () => {
			it("should reject when startDate equals endDate", () => {
				const invalidPeriod = {
					startDate: "2024-01-01",
					endDate: "2024-01-01",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Start date must be before end date");
					const dateError = result.error.issues.find(
						(e) => e.message === "Start date must be before end date",
					);
					expect(dateError?.path).toEqual(["endDate"]);
				}
			});

			it("should reject when startDate is after endDate", () => {
				const invalidPeriod = {
					startDate: "2024-12-31",
					endDate: "2024-01-01",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Start date must be before end date");
				}
			});

			it("should reject when startDate is one day after endDate", () => {
				const invalidPeriod = {
					startDate: "2024-01-02",
					endDate: "2024-01-01",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
			});

			it("should place error on endDate field", () => {
				const invalidPeriod = {
					startDate: "2024-12-31",
					endDate: "2024-01-01",
				};

				const result = ClaimPeriodSchema.safeParse(invalidPeriod);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const dateError = result.error.issues.find((e) =>
						e.path.includes("endDate"),
					);
					expect(dateError).toBeDefined();
				}
			});
		});
	});

	describe("CreateClaimFormSchema", () => {
		describe("Valid Inputs", () => {
			it("should accept valid claim with all required fields", () => {
				const validClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});

			it("should accept claim with optional projectIds", () => {
				const validClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
					projectIds: ["proj-1", "proj-2"],
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});

			it("should accept claim with empty projectIds array", () => {
				const validClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
					projectIds: [],
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});

			it("should accept claim without projectIds field", () => {
				const validClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});
		});

		describe("Company Name Validation", () => {
			it("should reject missing company name", () => {
				const invalidClaim = {
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
			});

			it("should reject empty company name", () => {
				const invalidClaim = {
					companyName: "",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Company name is required");
				}
			});

			it("should reject company name exceeding 200 characters", () => {
				const invalidClaim = {
					companyName: "A".repeat(201),
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain(
						"Company name must be at most 200 characters",
					);
				}
			});

			it("should accept company name at exactly 200 characters", () => {
				const validClaim = {
					companyName: "A".repeat(200),
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});

			it("should accept company name with one character", () => {
				const validClaim = {
					companyName: "A",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});
		});

		describe("Amount Validation", () => {
			it("should reject missing amount", () => {
				const invalidClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
			});

			it("should reject zero amount", () => {
				const invalidClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 0,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Amount must be positive");
				}
			});

			it("should reject negative amount", () => {
				const invalidClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: -10000,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Amount must be positive");
				}
			});

			it("should reject decimal amount", () => {
				const invalidClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 100.5,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Amount must be an integer (pence)");
				}
			});

			it("should reject string amount", () => {
				const invalidClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: "50000",
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
			});

			it("should accept amount of 1 pence", () => {
				const validClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 1,
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});

			it("should accept very large amounts", () => {
				const validClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					amount: 999999999,
				};

				const result = CreateClaimFormSchema.safeParse(validClaim);

				expect(result.success).toBe(true);
			});
		});

		describe("Nested ClaimPeriod Validation", () => {
			it("should reject claim with invalid date period", () => {
				const invalidClaim = {
					companyName: "Test Company Ltd",
					claimPeriod: {
						startDate: "2024-12-31",
						endDate: "2024-01-01",
					},
					amount: 50000,
				};

				const result = CreateClaimFormSchema.safeParse(invalidClaim);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const dateError = result.error.issues.find((e) =>
						e.path.includes("claimPeriod"),
					);
					expect(dateError).toBeDefined();
				}
			});
		});
	});

	describe("CreateProjectFormSchema", () => {
		describe("Valid Inputs", () => {
			it("should accept valid project with all required fields", () => {
				const validProject = {
					name: "AI Research Project",
					description: "Machine learning research for product optimization",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});

			it("should accept project with minimal description", () => {
				const validProject = {
					name: "Test Project",
					description: "A",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});

			it("should accept project with description at max length", () => {
				const validProject = {
					name: "Test Project",
					description: "A".repeat(1000),
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});
		});

		describe("Project Name Validation", () => {
			it("should reject missing name", () => {
				const invalidProject = {
					description: "Test description",
				};

				const result = CreateProjectFormSchema.safeParse(invalidProject);

				expect(result.success).toBe(false);
			});

			it("should reject empty name", () => {
				const invalidProject = {
					name: "",
					description: "Test description",
				};

				const result = CreateProjectFormSchema.safeParse(invalidProject);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Project name is required");
				}
			});

			it("should reject name exceeding 200 characters", () => {
				const invalidProject = {
					name: "A".repeat(201),
					description: "Test description",
				};

				const result = CreateProjectFormSchema.safeParse(invalidProject);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain(
						"Project name must be at most 200 characters",
					);
				}
			});

			it("should accept name at exactly 200 characters", () => {
				const validProject = {
					name: "A".repeat(200),
					description: "Test description",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});

			it("should accept name with one character", () => {
				const validProject = {
					name: "A",
					description: "Test description",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});
		});

		describe("Description Validation", () => {
			it("should reject missing description", () => {
				const invalidProject = {
					name: "Test Project",
				};

				const result = CreateProjectFormSchema.safeParse(invalidProject);

				expect(result.success).toBe(false);
			});

			it("should reject empty description", () => {
				const invalidProject = {
					name: "Test Project",
					description: "",
				};

				const result = CreateProjectFormSchema.safeParse(invalidProject);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain("Description is required");
				}
			});

			it("should reject description exceeding 1000 characters", () => {
				const invalidProject = {
					name: "Test Project",
					description: "A".repeat(1001),
				};

				const result = CreateProjectFormSchema.safeParse(invalidProject);

				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBeDefined();
					const errorMessages = result.error.issues.map((e) => e.message);
					expect(errorMessages).toContain(
						"Description must be at most 1000 characters",
					);
				}
			});

			it("should accept description at exactly 1000 characters", () => {
				const validProject = {
					name: "Test Project",
					description: "A".repeat(1000),
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});

			it("should accept description with one character", () => {
				const validProject = {
					name: "Test Project",
					description: "A",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});

			it("should accept description with special characters", () => {
				const validProject = {
					name: "Test Project",
					description:
						"Testing with special chars: !@#$%^&*()_+-=[]{}|;:',.<>?",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});

			it("should accept description with newlines", () => {
				const validProject = {
					name: "Test Project",
					description: "Line 1\nLine 2\nLine 3",
				};

				const result = CreateProjectFormSchema.safeParse(validProject);

				expect(result.success).toBe(true);
			});
		});
	});
});
