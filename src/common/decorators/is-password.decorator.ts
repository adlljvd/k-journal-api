import { ValidationOptions, registerDecorator } from 'class-validator';

/**
 * Validates that a string is a valid password:
 * - minimum 8 characters
 * - no maximum limit per the spec
 */
export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') {
            return false;
          }
          // Minimum 8 characters
          return value.length >= 8;
        },
        defaultMessage(): string {
          return 'Password must be at least 8 characters long';
        },
      },
    });
  };
}
