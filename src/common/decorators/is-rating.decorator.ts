import { ValidationOptions, registerDecorator } from 'class-validator';

/**
 * Validates that a number is a valid rating:
 * - 0.5 to 5.0
 * - in 0.5 increments (0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0)
 */
export function IsRating(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          // Allow null or undefined (rating is optional)
          if (value === null || value === undefined) {
            return true;
          }
          if (typeof value !== 'number') {
            return false;
          }
          // Check range: 0.5 to 5.0
          if (value < 0.5 || value > 5.0) {
            return false;
          }
          // Check 0.5 increments using modulo
          // Multiply by 2 to avoid floating point issues, then check if divisible by 1
          const scaledValue = value * 2;
          return Number.isInteger(scaledValue) && scaledValue % 1 === 0;
        },
        defaultMessage(): string {
          return 'Rating must be between 0.5 and 5.0 in 0.5 increments';
        },
      },
    });
  };
}
