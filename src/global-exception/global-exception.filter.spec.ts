import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('GlobalExceptionFilter', () => {
  it('should be defined', () => {
    expect(new GlobalExceptionFilter()).toBeDefined();
  });

  describe('GlobalExceptionFilter', () => {
    let globalExceptionFilter: GlobalExceptionFilter;
    let mockArgumentsHost: ArgumentsHost;
    let mockResponse: Response;
    let mockRequest: Request;

    beforeEach(() => {
      globalExceptionFilter = new GlobalExceptionFilter();
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      mockRequest = {
        url: '/test-url',
      } as any;
      mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: () => mockResponse,
          getRequest: () => mockRequest,
        }),
      } as any;
    });

    it('should be defined', () => {
      expect(globalExceptionFilter).toBeDefined();
    });

    it('should handle HttpException correctly', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      globalExceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.FORBIDDEN,
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should handle non-HttpException correctly', () => {
      const exception = new Error('Some error');

      globalExceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });

    it('should handle non-exception correctly', () => {
      const exception = {
        error: 'An error occurred',
        debug: 'No stack trace available',
      };

      globalExceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: '/test-url',
      });
    });
  });
});
