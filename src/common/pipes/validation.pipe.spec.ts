/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createValidationPipe } from './validation.pipe';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { IsString, IsNumber, IsOptional } from 'class-validator';

class TestDto {
  @IsString()
  name!: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}

describe('createValidationPipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = createValidationPipe();
  });

  it('should be defined', () => {
    expect(validationPipe).toBeDefined();
  });

  it('should create a ValidationPipe instance', () => {
    expect(validationPipe).toBeInstanceOf(ValidationPipe);
  });

  describe('whitelist', () => {
    it('should accept valid whitelisted properties', async () => {
      const input = { name: 'John' };

      const result = await validationPipe.transform(input, {
        metatype: TestDto,
        type: 'body',
      });

      expect(result).toEqual({ name: 'John' });
    });
  });

  describe('forbidNonWhitelisted', () => {
    it('should throw BadRequestException when non-whitelisted properties are present', async () => {
      const input = { name: 'John', forbiddenProperty: 'not-allowed' };

      await expect(
        validationPipe.transform(input, { metatype: TestDto, type: 'body' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw with error message containing property name', async () => {
      const input = { name: 'John', extraField: 'value' };

      try {
        await validationPipe.transform(input, {
          metatype: TestDto,
          type: 'body',
        });
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = (error as BadRequestException).getResponse();
        expect(JSON.stringify(response)).toContain('extraField');
      }
    });
  });

  describe('transform', () => {
    it('should transform string number to number for numeric properties', async () => {
      const input = { name: 'John', age: '25' };

      const result = await validationPipe.transform(input, {
        metatype: TestDto,
        type: 'body',
      });

      expect(result.age).toBe(25);
      expect(typeof result.age).toBe('number');
    });

    it('should transform valid input to DTO instance', async () => {
      const input = { name: 'Jane', age: 30 };

      const result = await validationPipe.transform(input, {
        metatype: TestDto,
        type: 'body',
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('Jane');
      expect(result.age).toBe(30);
    });

    it('should not transform when metatype is not provided', async () => {
      const input = { name: 'John' };

      const result = await validationPipe.transform(input, {
        metatype: null as any,
        type: 'body',
      });

      expect(result).toEqual(input);
    });
  });

  describe('validation', () => {
    it('should throw BadRequestException when validation fails', async () => {
      const invalidInput = { name: 'John', age: 'not-a-number' }; // age should be a valid number

      await expect(
        validationPipe.transform(invalidInput, {
          metatype: TestDto,
          type: 'body',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when required property is missing', async () => {
      const invalidInput = { age: 25 }; // name is required

      await expect(
        validationPipe.transform(invalidInput, {
          metatype: TestDto,
          type: 'body',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should pass validation with valid DTO', async () => {
      const validInput = { name: 'ValidName' };

      const result = await validationPipe.transform(validInput, {
        metatype: TestDto,
        type: 'body',
      });

      expect(result.name).toBe('ValidName');
    });

    it('should pass validation with all properties provided', async () => {
      const validInput = { name: 'CompleteUser', age: 28 };

      const result = await validationPipe.transform(validInput, {
        metatype: TestDto,
        type: 'body',
      });

      expect(result.name).toBe('CompleteUser');
      expect(result.age).toBe(28);
    });
  });
});
