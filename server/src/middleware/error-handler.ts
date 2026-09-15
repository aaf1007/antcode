import type { ErrorRequestHandler } from "express";

const parserErrors = new Map([
  ["entity.parse.failed", 400],
  ["request.aborted", 400],
  ["request.size.invalid", 400],
  ["entity.verify.failed", 403],
  ["entity.too.large", 413],
  ["charset.unsupported", 415],
  ["encoding.unsupported", 415],
]);

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error);
  let status = error instanceof URIError ? 400 : 500;
  // Ignore arbitrary error.status values; parser errors must have a known type and status.
  if (error instanceof Error && "type" in error && typeof error.type === "string") {
    const parserStatus = parserErrors.get(error.type);
    if (parserStatus !== undefined && "status" in error && error.status === parserStatus) {
      status = parserStatus;
    }
  }
  if (status === 500) console.error(`${request.method} ${request.path} failed`, error);
  response.status(status).json({
    error: status === 500 ? "Internal server error." : "Invalid request.",
  });
};
