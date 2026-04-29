import { ValidationOptions, registerDecorator } from 'class-validator';

/**
 * Validates that a string is a valid username:
 * - 3-30 characters
 * - alphanumeric and underscores only
 * - must start with a letter
 */
export function IsUsername(
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
          const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
          return usernameRegex.test(value);
        },
        defaultMessage(): string {
          return 'Username must be 3-30 characters, start with a letter, and contain only letters, numbers, and underscores';
        },
      },
    });
  };
}
