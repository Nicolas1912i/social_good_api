import request from 'supertest';
import express from 'express';
import ContactRouter from '../../../src/presentation/routers/contact-router';
import { GetAllContactsUseCase } from '../../domain/interfaces/use-cases/contact/get-all-contacts';
import { CreateContactsUseCase } from '../../domain/interfaces/use-cases/contact/create-contact';
import { GetUploadStatusUseCase } from '../../domain/interfaces/use-cases/contact/get-upload-status';

global.fetch = jest.fn(() =>
  Promise.resolve({
    url: 'https://mocked-auth-url.com'
  } as unknown as Response)
);

describe('ContactRouter', () => {
  let app: express.Application;
  let mockGetAllContactsUseCase: jest.Mocked<GetAllContactsUseCase>;
  let mockCreateContactsUseCase: jest.Mocked<CreateContactsUseCase>;
  let mockGetUploadStatusUseCase: jest.Mocked<GetUploadStatusUseCase>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock use cases
    mockGetAllContactsUseCase = { execute: jest.fn() };
    mockCreateContactsUseCase = { execute: jest.fn() };
    mockGetUploadStatusUseCase = { execute: jest.fn() };

    // Setup express app with router
    app = express();
    app.use(express.json());
    app.use('/', ContactRouter(
      mockGetAllContactsUseCase,
      mockCreateContactsUseCase,
      mockGetUploadStatusUseCase
    ));
  });

  describe('GET /authorize', () => {
    it('should redirect to Constant Contact authorization URL', async () => {
      const clientId = 'test-client-id';
      const redirectUrl = 'http://test-redirect.com';
      const expectedAuthUrl = `https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=token&state=NICK1912&nonce=NICK1912&scope=contact_data`;

      const response = await request(app)
        .get('/authorize')
        .query({
          clientId,
          redirectUrl
        });

      expect(fetch).toHaveBeenCalledWith(expectedAuthUrl, {});
      expect(response.status).toBe(302); // Expecting redirect status
    });
  });

  describe('GET /contacts', () => {
    it('should return contacts when successful', async () => {
      const mockContacts = [
        { contact_id: '123', email_address: { address: 'test@example.com' } }
      ];
      mockGetAllContactsUseCase.execute.mockResolvedValue(mockContacts);

      const response = await request(app)
        .get('/contacts')
        .query({ access_token: 'test-token' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockContacts);
      expect(mockGetAllContactsUseCase.execute).toHaveBeenCalledWith('test-token');
    });

    it('should return 500 when contacts retrieval fails', async () => {
      mockGetAllContactsUseCase.execute.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/contacts')
        .query({ access_token: 'test-token' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error fetching data');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /contacts', () => {
    it('should create contacts and return activity ID when successful', async () => {
      const mockContacts = [{ email: 'test@example.com' }];
      const mockActivityId = 'mock-activity-id';
      mockCreateContactsUseCase.execute.mockResolvedValue(mockActivityId);

      const response = await request(app)
        .post('/contacts')
        .query({ access_token: 'test-token' })
        .send(mockContacts);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Successfully started import process',
        activity_id: mockActivityId
      });
      expect(mockCreateContactsUseCase.execute).toHaveBeenCalledWith(mockContacts, 'test-token');
    });

    it('should return 500 when contact creation fails', async () => {
      const mockContacts = [{ email: 'test@example.com' }];
      mockCreateContactsUseCase.execute.mockRejectedValue(new Error('API error'));

      const response = await request(app)
        .post('/contacts')
        .query({ access_token: 'test-token' })
        .send(mockContacts);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error saving data');
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /status', () => {
    it('should return activity status when successful', async () => {
      const mockActivityId = 'mock-activity-id';
      const mockStatus = 'COMPLETE';
      mockGetUploadStatusUseCase.execute.mockResolvedValue(mockStatus);

      const response = await request(app)
        .get('/status')
        .query({
          access_token: 'test-token',
          activity_id: mockActivityId
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: mockStatus });
      expect(mockGetUploadStatusUseCase.execute).toHaveBeenCalledWith('test-token', mockActivityId);
    });

    it('should return 500 when status retrieval fails', async () => {
      const mockActivityId = 'mock-activity-id';
      mockGetUploadStatusUseCase.execute.mockRejectedValue(new Error('Status error'));

      const response = await request(app)
        .get('/status')
        .query({
          access_token: 'test-token',
          activity_id: mockActivityId
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Error saving data');
      expect(response.body).toHaveProperty('error');
    });
  });
});