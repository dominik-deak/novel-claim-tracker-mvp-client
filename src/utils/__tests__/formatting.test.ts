import { describe, expect, it } from "vitest";
import { formatAmount, formatDateRange } from "../formatting";

describe("Formatting Utilities", () => {
	describe("formatAmount", () => {
		describe("Standard Amounts", () => {
			it("should format typical amounts correctly", () => {
				expect(formatAmount(50000)).toBe("£500.00");
				expect(formatAmount(100000)).toBe("£1,000.00");
				expect(formatAmount(12345)).toBe("£123.45");
			});

			it("should format amounts with comma separators for thousands", () => {
				expect(formatAmount(123456)).toBe("£1,234.56");
				expect(formatAmount(1234567)).toBe("£12,345.67");
				expect(formatAmount(12345678)).toBe("£123,456.78");
			});

			it("should always show two decimal places", () => {
				expect(formatAmount(100)).toBe("£1.00");
				expect(formatAmount(1000)).toBe("£10.00");
				expect(formatAmount(10000)).toBe("£100.00");
			});
		});

		describe("Zero and Small Amounts", () => {
			it("should format zero correctly", () => {
				expect(formatAmount(0)).toBe("£0.00");
			});

			it("should format single pence correctly", () => {
				expect(formatAmount(1)).toBe("£0.01");
				expect(formatAmount(5)).toBe("£0.05");
				expect(formatAmount(99)).toBe("£0.99");
			});

			it("should format amounts under one pound", () => {
				expect(formatAmount(10)).toBe("£0.10");
				expect(formatAmount(25)).toBe("£0.25");
				expect(formatAmount(50)).toBe("£0.50");
				expect(formatAmount(75)).toBe("£0.75");
			});
		});

		describe("Large Amounts", () => {
			it("should format amounts in hundreds of thousands", () => {
				expect(formatAmount(10000000)).toBe("£100,000.00");
				expect(formatAmount(50000000)).toBe("£500,000.00");
			});

			it("should format amounts in millions", () => {
				expect(formatAmount(100000000)).toBe("£1,000,000.00");
				expect(formatAmount(123456789)).toBe("£1,234,567.89");
			});

			it("should format amounts in billions", () => {
				expect(formatAmount(1000000000)).toBe("£10,000,000.00");
			});
		});

		describe("Negative Amounts", () => {
			it("should format negative amounts correctly", () => {
				expect(formatAmount(-10000)).toBe("-£100.00");
				expect(formatAmount(-50000)).toBe("-£500.00");
			});

			it("should format negative pence correctly", () => {
				expect(formatAmount(-1)).toBe("-£0.01");
				expect(formatAmount(-99)).toBe("-£0.99");
			});

			it("should format large negative amounts", () => {
				expect(formatAmount(-123456789)).toBe("-£1,234,567.89");
			});
		});

		describe("Edge Cases", () => {
			it("should handle very large numbers", () => {
				const result = formatAmount(999999999999);
				expect(result).toContain("£");
				expect(result).toContain(",");
			});

			it("should format amounts with odd pence values", () => {
				expect(formatAmount(10001)).toBe("£100.01");
				expect(formatAmount(10099)).toBe("£100.99");
				expect(formatAmount(12307)).toBe("£123.07");
			});

			it("should handle decimal precision correctly", () => {
				// These test that there's no floating point issues
				expect(formatAmount(333)).toBe("£3.33");
				expect(formatAmount(666)).toBe("£6.66");
				expect(formatAmount(999)).toBe("£9.99");
			});
		});
	});

	describe("formatDateRange", () => {
		describe("Standard Date Ranges", () => {
			it("should format a typical date range", () => {
				const result = formatDateRange("2024-01-01", "2024-12-31");
				expect(result).toBe("01/01/2024 - 31/12/2024");
			});

			it("should format dates in en-GB format (DD/MM/YYYY)", () => {
				const result = formatDateRange("2024-03-15", "2024-06-20");
				expect(result).toBe("15/03/2024 - 20/06/2024");
			});

			it("should format date range within the same month", () => {
				const result = formatDateRange("2024-05-01", "2024-05-15");
				expect(result).toBe("01/05/2024 - 15/05/2024");
			});
		});

		describe("Same Date", () => {
			it("should format when start and end dates are the same", () => {
				const result = formatDateRange("2024-06-15", "2024-06-15");
				expect(result).toBe("15/06/2024 - 15/06/2024");
			});

			it("should format same date at year boundaries", () => {
				const result = formatDateRange("2024-01-01", "2024-01-01");
				expect(result).toBe("01/01/2024 - 01/01/2024");
			});
		});

		describe("Date Ranges Across Boundaries", () => {
			it("should format dates across month boundaries", () => {
				const result = formatDateRange("2024-01-31", "2024-02-01");
				expect(result).toBe("31/01/2024 - 01/02/2024");
			});

			it("should format dates across year boundaries", () => {
				const result = formatDateRange("2023-12-31", "2024-01-01");
				expect(result).toBe("31/12/2023 - 01/01/2024");
			});

			it("should format dates spanning multiple years", () => {
				const result = formatDateRange("2023-01-01", "2024-12-31");
				expect(result).toBe("01/01/2023 - 31/12/2024");
			});

			it("should format dates spanning multiple months", () => {
				const result = formatDateRange("2024-02-15", "2024-08-20");
				expect(result).toBe("15/02/2024 - 20/08/2024");
			});
		});

		describe("Special Dates", () => {
			it("should format leap year dates correctly", () => {
				const result = formatDateRange("2024-02-29", "2024-03-01");
				expect(result).toBe("29/02/2024 - 01/03/2024");
			});

			it("should format dates with single digit days", () => {
				const result = formatDateRange("2024-01-01", "2024-01-09");
				expect(result).toBe("01/01/2024 - 09/01/2024");
			});

			it("should format end of month dates", () => {
				const result = formatDateRange("2024-01-31", "2024-03-31");
				expect(result).toBe("31/01/2024 - 31/03/2024");
			});

			it("should format February non-leap year dates", () => {
				const result = formatDateRange("2023-02-28", "2023-03-01");
				expect(result).toBe("28/02/2023 - 01/03/2023");
			});
		});

		describe("Different Year Ranges", () => {
			it("should format dates many years apart", () => {
				const result = formatDateRange("2020-01-01", "2024-12-31");
				expect(result).toBe("01/01/2020 - 31/12/2024");
			});

			it("should format backward year range", () => {
				const result = formatDateRange("2024-12-31", "2024-01-01");
				expect(result).toBe("31/12/2024 - 01/01/2024");
			});
		});

		describe("ISO Date Format Input", () => {
			it("should handle ISO date strings without time", () => {
				const result = formatDateRange("2024-01-15", "2024-02-20");
				expect(result).toBe("15/01/2024 - 20/02/2024");
			});

			it("should handle ISO date strings with time component", () => {
				const result = formatDateRange(
					"2024-01-15T00:00:00.000Z",
					"2024-02-20T23:59:59.999Z",
				);
				// Time component should be ignored, only date matters
				expect(result).toContain("01/2024");
				expect(result).toContain("02/2024");
			});

			it("should handle ISO date strings with timezone", () => {
				const result = formatDateRange(
					"2024-06-01T12:00:00Z",
					"2024-06-30T12:00:00Z",
				);
				expect(result).toContain("06/2024");
				expect(result).toContain(" - ");
			});
		});

		describe("Edge Cases", () => {
			it("should format dates at decade boundaries", () => {
				const result = formatDateRange("2019-12-31", "2020-01-01");
				expect(result).toBe("31/12/2019 - 01/01/2020");
			});

			it("should format dates at century boundaries", () => {
				const result = formatDateRange("1999-12-31", "2000-01-01");
				expect(result).toBe("31/12/1999 - 01/01/2000");
			});

			it("should format dates far in the past", () => {
				const result = formatDateRange("1900-01-01", "1900-12-31");
				expect(result).toBe("01/01/1900 - 31/12/1900");
			});

			it("should format dates far in the future", () => {
				const result = formatDateRange("2100-01-01", "2100-12-31");
				expect(result).toBe("01/01/2100 - 31/12/2100");
			});
		});

		describe("Output Format Consistency", () => {
			it("should always include the separator ' - '", () => {
				const result = formatDateRange("2024-01-01", "2024-12-31");
				expect(result).toContain(" - ");
			});

			it("should always use forward slashes for dates", () => {
				const result = formatDateRange("2024-01-01", "2024-12-31");
				expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/);
			});

			it("should always use DD/MM/YYYY format", () => {
				const result = formatDateRange("2024-03-05", "2024-08-25");
				// Check that day comes before month (05 is the day, 03 is the month)
				expect(result).toBe("05/03/2024 - 25/08/2024");
			});
		});
	});
});
