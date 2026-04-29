import { ValidationOptions, registerDecorator } from 'class-validator';

/**
 * Validates that a string is a valid URL (optional):
 * - If value is empty/null/undefined, passes (optional field)
 * - If value is provided, must be a valid URL
 */
export function IsOptionalUrl(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          // Allow null, undefined, or empty string (optional field)
          if (value === null || value === undefined || value === '') {
            return true;
          }
          if (typeof value !== 'string') {
            return false;
          }
          try {
            const url = new URL(value);
            return url.protocol === 'http:' || url.protocol === 'https:';
          } catch {
            return false;
          }
        },
        defaultMessage(): string {
          return 'If provided, must be a valid URL (http or https)';
        },
      },
    });
  };
}
