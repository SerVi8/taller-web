export type ApiErrorDetails = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly details: ApiErrorDetails | undefined;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: ApiErrorDetails,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
