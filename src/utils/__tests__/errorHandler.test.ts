import type { InternalAxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { getErrorMessage } from "../errorHandler";

describe("getErrorMessage", () => {
	describe("Axios Error Handling", () => {
		it("should extract error from response.data.error", () => {
			const axiosError = new AxiosError(
				"Request failed",
				"ERR_BAD_REQUEST",
				undefined,
				{},
				{
					status: 400,
					statusText: "Bad Request",
					data: { error: "Invalid claim data" },
					headers: {},
					config: {} as InternalAxiosRequestConfig,
				},
			);

			const result = getErrorMessage(axiosError);

			expect(result).toBe("Invalid claim data");
		});

		it("should fall back to error.message when no response.data.error", () => {
			const axiosError = new AxiosError(
				"Network Error",
				"ERR_NETWORK",
				undefined,
				{},
				{
					status: 500,
					statusText: "Internal Server Error",
					data: { message: "Something went wrong" },
					headers: {},
					config: {} as InternalAxiosRequestConfig,
				},
			);

			const result = getErrorMessage(axiosError);

			expect(result).toBe("Network Error");
		});

		it("should handle AxiosError without response", () => {
			const axiosError = new AxiosError(
				"Request timeout",
				"ECONNABORTED",
				undefined,
				{},
				undefined,
			);

			const result = getErrorMessage(axiosError);

			expect(result).toBe("Request timeout");
		});

		it("should handle AxiosError with empty response.data", () => {
			const axiosError = new AxiosError(
				"Server error",
				"ERR_BAD_RESPONSE",
				undefined,
				{},
				{
					status: 500,
					statusText: "Internal Server Error",
					data: {},
					headers: {},
					config: {} as InternalAxiosRequestConfig,
				},
			);

			const result = getErrorMessage(axiosError);

			expect(result).toBe("Server error");
		});

		it("should handle AxiosError with null response.data", () => {
			const axiosError = new AxiosError(
				"No response data",
				"ERR_BAD_RESPONSE",
				undefined,
				{},
				{
					status: 204,
					statusText: "No Content",
					data: null,
					headers: {},
					config: {} as InternalAxiosRequestConfig,
				},
			);

			const result = getErrorMessage(axiosError);

			expect(result).toBe("No response data");
		});

		it("should handle AxiosError with empty string error", () => {
			const axiosError = new AxiosError(
				"Fallback message",
				"ERR_BAD_REQUEST",
				undefined,
				{},
				{
					status: 400,
					statusText: "Bad Request",
					data: { error: "" },
					headers: {},
					config: {} as InternalAxiosRequestConfig,
				},
			);

			const result = getErrorMessage(axiosError);

			// Empty string is falsy, should fall back to error.message
			expect(result).toBe("Fallback message");
		});
	});

	describe("Standard Error Handling", () => {
		it("should extract message from Error instances", () => {
			const error = new Error("Database connection failed");

			const result = getErrorMessage(error);

			expect(result).toBe("Database connection failed");
		});

		it("should handle custom Error subclasses", () => {
			class CustomError extends Error {
				constructor(message: string) {
					super(message);
					this.name = "CustomError";
				}
			}

			const error = new CustomError("Custom error occurred");

			const result = getErrorMessage(error);

			expect(result).toBe("Custom error occurred");
		});

		it("should handle Error with empty message", () => {
			const error = new Error("");

			const result = getErrorMessage(error);

			expect(result).toBe("");
		});
	});

	describe("String Error Handling", () => {
		it("should return string as-is when error is a string", () => {
			const error = "Simple string error";

			const result = getErrorMessage(error);

			expect(result).toBe("Simple string error");
		});

		it("should handle empty string", () => {
			const error = "";

			const result = getErrorMessage(error);

			expect(result).toBe("");
		});

		it("should handle multi-line string errors", () => {
			const error = "Line 1\nLine 2\nLine 3";

			const result = getErrorMessage(error);

			expect(result).toBe("Line 1\nLine 2\nLine 3");
		});
	});

	describe("Unknown Error Handling", () => {
		it("should return default message for null", () => {
			const result = getErrorMessage(null);

			expect(result).toBe("An unexpected error occurred");
		});

		it("should return default message for undefined", () => {
			const result = getErrorMessage(undefined);

			expect(result).toBe("An unexpected error occurred");
		});

		it("should return default message for number", () => {
			const result = getErrorMessage(404);

			expect(result).toBe("An unexpected error occurred");
		});

		it("should return default message for plain object", () => {
			const result = getErrorMessage({ code: 500, message: "Error" });

			expect(result).toBe("An unexpected error occurred");
		});

		it("should return default message for array", () => {
			const result = getErrorMessage(["error1", "error2"]);

			expect(result).toBe("An unexpected error occurred");
		});

		it("should return default message for boolean", () => {
			const result = getErrorMessage(false);

			expect(result).toBe("An unexpected error occurred");
		});

		it("should return default message for symbol", () => {
			const result = getErrorMessage(Symbol("error"));

			expect(result).toBe("An unexpected error occurred");
		});
	});
});
