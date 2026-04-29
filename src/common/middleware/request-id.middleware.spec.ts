/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RequestIdMiddleware } from './request-id.middleware';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let mockReq: jest.Mocked<any>;
  let mockRes: jest.Mocked<any>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should generate UUID when x-request-id header is not present', () => {
      const generatedUuid = 'generated-uuid-123';
      (uuidv4 as jest.Mock).mockReturnValue(generatedUuid);

      mockReq = { headers: {} };
      mockRes = { header: jest.fn() };

      middleware.use(mockReq, mockRes, mockNext);

      expect(uuidv4).toHaveBeenCalled();
      expect(mockReq.requestId).toBe(generatedUuid);
      expect(mockRes.header).toHaveBeenCalledWith(
        'x-request-id',
        generatedUuid,
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should use existing x-request-id header when present', () => {
      const existingRequestId = 'existing-request-id-456';
      (uuidv4 as jest.Mock).mockReturnValue('should-not-be-used');

      mockReq = { headers: { 'x-request-id': existingRequestId } };
      mockRes = { header: jest.fn() };

      middleware.use(mockReq, mockRes, mockNext);

      expect(uuidv4).not.toHaveBeenCalled();
      expect(mockReq.requestId).toBe(existingRequestId);
      expect(mockRes.header).toHaveBeenCalledWith(
        'x-request-id',
        existingRequestId,
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set response header using res.header() when available', () => {
      const generatedUuid = 'uuid-via-header';
      (uuidv4 as jest.Mock).mockReturnValue(generatedUuid);

      mockReq = { headers: {} };
      mockRes = { header: jest.fn() };

      middleware.use(mockReq, mockRes, mockNext);

      expect(mockRes.header).toHaveBeenCalledWith(
        'x-request-id',
        generatedUuid,
      );
    });

    it('should set response header using res.raw.setHeader() when res.header is not a function', () => {
      const generatedUuid = 'uuid-via-raw';
      (uuidv4 as jest.Mock).mockReturnValue(generatedUuid);

      mockReq = { headers: {} };
      mockRes = {
        header: 'not-a-function',
        raw: { setHeader: jest.fn() },
      };

      middleware.use(mockReq, mockRes, mockNext);

      expect(mockRes.raw.setHeader).toHaveBeenCalledWith(
        'x-request-id',
        generatedUuid,
      );
    });

    it('should handle case when neither res.header nor res.raw.setHeader is available', () => {
      const generatedUuid = 'uuid-no-header';
      (uuidv4 as jest.Mock).mockReturnValue(generatedUuid);

      mockReq = { headers: {} };
      mockRes = {
        header: 'not-a-function',
        raw: { setHeader: 'not-a-function' },
      };

      middleware.use(mockReq, mockRes, mockNext);

      // Should still set requestId and call next
      expect(mockReq.requestId).toBe(generatedUuid);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle case when res.raw does not exist', () => {
      const generatedUuid = 'uuid-no-raw';
      (uuidv4 as jest.Mock).mockReturnValue(generatedUuid);

      mockReq = { headers: {} };
      mockRes = {
        header: 'not-a-function',
      };

      middleware.use(mockReq, mockRes, mockNext);

      // Should still set requestId and call next
      expect(mockReq.requestId).toBe(generatedUuid);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() after processing', () => {
      (uuidv4 as jest.Mock).mockReturnValue('test-uuid');

      mockReq = { headers: {} };
      mockRes = { header: jest.fn() };

      middleware.use(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should prefer x-request-id header over generated UUID', () => {
      const headerRequestId = 'header-request-id';
      (uuidv4 as jest.Mock).mockReturnValue('generated-uuid');

      mockReq = { headers: { 'x-request-id': headerRequestId } };
      mockRes = { header: jest.fn() };

      middleware.use(mockReq, mockRes, mockNext);

      expect(mockReq.requestId).toBe(headerRequestId);
      expect(uuidv4).not.toHaveBeenCalled();
    });
  });
});
