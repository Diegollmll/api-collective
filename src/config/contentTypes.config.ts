export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain'
} as const;

export const DEFAULT_ALLOWED_TYPES = [
  CONTENT_TYPES.JSON,
  CONTENT_TYPES.FORM_DATA
] as const; 