/** Custom error type. Self-explanatory. */
export class NoUrlInEnvError extends Error {
  /** Create a new error object. */
  constructor() {
    super('The `SUPABASE_URL` environment variable could not be found.');
  }
}

/** Custom error type. Self-explanatory. */
export class NoKeyInEnvError extends Error {
  /** Create a new error object. */
  constructor() {
    super('The `SUPABASE_ANON_KEY` environment variable could not be found.');
  }
}
