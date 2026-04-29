import { ValidationPipe } from '@nestjs/common';

/**
 * Creates a global ValidationPipe instance configured for the K-Journal API.
 *
 * Configuration:
 * - whitelist: true - strips properties not defined in DTOs
 * - forbidNonWhitelisted: true - throws error if non-whitelisted properties present
 * - transform: true - automatically transforms payloads to DTO instances
 * - transformOptions: enables explicit nulls to be transformed
 */
export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    },
  });
