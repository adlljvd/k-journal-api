import { INestApplication } from '@nestjs/common';

/**
 * Swagger Configuration Unit Tests
 *
 * Tests verify DocumentBuilder configuration is correct without starting a real server.
 * Coverage: QUALITY.md P0 Scenarios 1, 2, 3, 4, 8
 * - Scenario 1: DocumentBuilder.setTitle() called with expected value
 * - Scenario 2: DocumentBuilder.setDescription() called with expected value
 * - Scenario 3: DocumentBuilder.setVersion() called with expected value
 * - Scenario 4: SwaggerModule.setup() called with '/api/docs' path
 * - Scenario 8: DocumentBuilder.addBearerAuth() called during setup
 */

// Mock DocumentBuilder with chainable methods that track calls
const mockDocumentBuilder = {
  setTitle: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  setVersion: jest.fn().mockReturnThis(),
  addBearerAuth: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnValue({}),
};

// Mock SwaggerModule
const mockSwaggerModule = {
  createDocument: jest.fn().mockReturnValue({ openapi: '3.0.0', paths: {} }),
  setup: jest.fn(),
};

// Mock the entire @nestjs/swagger module with all decorators as no-ops
jest.mock('@nestjs/swagger', () => ({
  // Classes and functions we need to mock
  DocumentBuilder: jest.fn().mockImplementation(() => mockDocumentBuilder),
  SwaggerModule: mockSwaggerModule,

  // Decorators - all return no-op functions
  ApiProperty: () => () => {},
  ApiPropertyOptional: () => () => {},
  ApiTags: () => () => {},
  ApiOperation: () => () => {},
  ApiResponse: () => () => {},
  ApiBearerAuth: () => () => {},
  ApiParam: () => () => {},
  ApiQuery: () => () => {},
  ApiBody: () => () => {},
  ApiHeader: () => () => {},
  ApiHeaders: () => () => {},
  ApiExcludeEndpoint: () => () => {},
  ApiCreatedResponse: () => () => {},
  ApiOkResponse: () => () => {},
  ApiNotFoundResponse: () => () => {},
  ApiBadRequestResponse: () => () => {},
  ApiUnauthorizedResponse: () => () => {},
  ApiForbiddenResponse: () => () => {},
  ApiConflictResponse: () => () => {},
  ApiInternalServerErrorResponse: () => () => {},
  ApiExtraModels: () => () => {},
  ApiOAuth2: () => () => {},
  ApiBasicAuth: () => () => {},
  ApiCookieAuth: () => () => {},
  ApiSecurity: () => () => {},
  ApiDefaultGetter: () => () => {},
  ApiExtension: () => () => {},
  ApiHideProperty: () => () => {},
  ApiExcludeController: () => () => {},
  OmitType: () => class {},
  PickType: () => class {},
  PartialType: () => class {},
  IntersectionType: () => class {},
  getSchemaPath: () => '',
}));

// Import setupSwagger AFTER mocking
import { setupSwagger } from '../../src/main';
import { DocumentBuilder } from '@nestjs/swagger';

describe('Swagger Configuration (unit)', () => {
  let mockApp: INestApplication;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a minimal mock application
    mockApp = {
      getHttpAdapter: jest.fn().mockReturnValue({
        getInstance: jest.fn().mockReturnValue({
          ready: jest.fn().mockResolvedValue(undefined),
        }),
      }),
    } as unknown as INestApplication;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DocumentBuilder Configuration', () => {
    /**
     * Scenario 1: DocumentBuilder configured with title
     * P0 - Core initialization requirement
     */
    it('should call DocumentBuilder.setTitle() with "K-Journal API"', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockDocumentBuilder.setTitle).toHaveBeenCalledWith(
        'K-Journal API',
      );
    });

    /**
     * Scenario 2: DocumentBuilder configured with description
     * P0 - Core initialization requirement
     */
    it('should call DocumentBuilder.setDescription() with expected description', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockDocumentBuilder.setDescription).toHaveBeenCalledWith(
        'API documentation for K-Journal application',
      );
    });

    /**
     * Scenario 3: DocumentBuilder configured with version
     * P0 - Core initialization requirement
     */
    it('should call DocumentBuilder.setVersion() with "1.0"', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockDocumentBuilder.setVersion).toHaveBeenCalledWith('1.0');
    });

    /**
     * Scenario 8: addBearerAuth called on DocumentBuilder
     * P0 - Security configuration requirement
     */
    it('should call DocumentBuilder.addBearerAuth() during setup', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockDocumentBuilder.addBearerAuth).toHaveBeenCalled();
    });
  });

  describe('SwaggerModule Setup', () => {
    /**
     * Scenario 4: SwaggerModule setup with correct path
     * P0 - Defines accessibility endpoint
     */
    it('should call SwaggerModule.setup() with "api/docs" path', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockSwaggerModule.setup).toHaveBeenCalledWith(
        'api/docs',
        mockApp,
        expect.objectContaining({}),
        expect.any(Object), // options object (jsonDocumentUrl, yamlDocumentUrl)
      );
    });

    it('should call SwaggerModule.createDocument() to generate the document', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockSwaggerModule.createDocument).toHaveBeenCalledWith(
        mockApp,
        expect.objectContaining({}),
      );
    });
  });

  describe('Environment Variable Toggle', () => {
    it('should skip setup when ENABLE_SWAGGER is "false"', () => {
      // Arrange
      const originalEnv = process.env.ENABLE_SWAGGER;
      process.env.ENABLE_SWAGGER = 'false';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert - DocumentBuilder should NOT be instantiated
      expect(DocumentBuilder).not.toHaveBeenCalled();
      expect(mockDocumentBuilder.setTitle).not.toHaveBeenCalled();
      expect(mockSwaggerModule.setup).not.toHaveBeenCalled();

      // Cleanup
      process.env.ENABLE_SWAGGER = originalEnv;
    });

    it('should setup Swagger when ENABLE_SWAGGER is undefined', () => {
      // Arrange
      const originalEnv = process.env.ENABLE_SWAGGER;
      delete process.env.ENABLE_SWAGGER;

      // Act
      setupSwagger(mockApp, 3000);

      // Assert - DocumentBuilder should be instantiated
      expect(mockDocumentBuilder.setTitle).toHaveBeenCalledWith(
        'K-Journal API',
      );
      expect(mockSwaggerModule.setup).toHaveBeenCalled();

      // Cleanup
      if (originalEnv !== undefined) {
        process.env.ENABLE_SWAGGER = originalEnv;
      }
    });

    it('should setup Swagger when ENABLE_SWAGGER is "true"', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert
      expect(mockDocumentBuilder.setTitle).toHaveBeenCalled();
      expect(mockSwaggerModule.setup).toHaveBeenCalled();
    });
  });

  describe('DocumentBuilder Method Call Order', () => {
    it('should call DocumentBuilder methods in the correct sequence', () => {
      // Arrange
      process.env.ENABLE_SWAGGER = 'true';

      // Act
      setupSwagger(mockApp, 3000);

      // Assert - verify build() is called after all configuration
      expect(mockDocumentBuilder.setTitle).toHaveBeenCalled();
      expect(mockDocumentBuilder.setDescription).toHaveBeenCalled();
      expect(mockDocumentBuilder.setVersion).toHaveBeenCalled();
      expect(mockDocumentBuilder.addBearerAuth).toHaveBeenCalled();
      expect(mockDocumentBuilder.build).toHaveBeenCalled();

      // Verify the order - build should be called last among DocumentBuilder methods
      const buildCallOrder =
        mockDocumentBuilder.build.mock.invocationCallOrder[0];
      const setTitleCallOrder =
        mockDocumentBuilder.setTitle.mock.invocationCallOrder[0];
      const setDescriptionCallOrder =
        mockDocumentBuilder.setDescription.mock.invocationCallOrder[0];
      const setVersionCallOrder =
        mockDocumentBuilder.setVersion.mock.invocationCallOrder[0];
      const addBearerAuthCallOrder =
        mockDocumentBuilder.addBearerAuth.mock.invocationCallOrder[0];

      // build() should be called after all setter methods
      expect(buildCallOrder).toBeGreaterThan(setTitleCallOrder);
      expect(buildCallOrder).toBeGreaterThan(setDescriptionCallOrder);
      expect(buildCallOrder).toBeGreaterThan(setVersionCallOrder);
      expect(buildCallOrder).toBeGreaterThan(addBearerAuthCallOrder);
    });
  });
});
