import { ContactRepositoryImpl } from "./contact-repository";
import { ContactDataSource } from "../../data/interfaces/data-sources/contact-data-source";

describe("ContactRepositoryImpl", () => {
  let repository: ContactRepositoryImpl;
  let mockDataSource: jest.Mocked<ContactDataSource>;
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    mockDataSource = {
      createCollection: jest.fn(),
      getAll: jest.fn(),
      getUploadStatus: jest.fn(),
    };
    repository = new ContactRepositoryImpl(mockDataSource);
  });

  describe("createCollection", () => {
    it("should call data source createCollection method", async () => {
      const mockContacts = [{ email: "test@example.com" }];
      const mockActivityId = "mock-activity-id";

      mockDataSource.createCollection.mockResolvedValue(mockActivityId);

      const result = await repository.createCollection(
        mockContacts,
        mockAccessToken,
      );

      expect(mockDataSource.createCollection).toHaveBeenCalledWith(
        mockContacts,
        mockAccessToken,
      );
      expect(result).toBe(mockActivityId);
    });
  });

  describe("getContacts", () => {
    it("should call data source getAll method", async () => {
      const mockContacts = [
        { contact_id: "123", email_address: { address: "test@example.com" } },
      ];

      mockDataSource.getAll.mockResolvedValue(mockContacts);

      const result = await repository.getContacts(mockAccessToken);

      expect(mockDataSource.getAll).toHaveBeenCalledWith(mockAccessToken);
      expect(result).toEqual(mockContacts);
    });
  });

  describe("getUploadStatus", () => {
    it("should call data source getUploadStatus method", async () => {
      const mockActivityId = "mock-activity-id";
      const mockStatus = "COMPLETE";

      mockDataSource.getUploadStatus.mockResolvedValue(mockStatus);

      const result = await repository.getUploadStatus(
        mockAccessToken,
        mockActivityId,
      );

      expect(mockDataSource.getUploadStatus).toHaveBeenCalledWith(
        mockAccessToken,
        mockActivityId,
      );
      expect(result).toBe(mockStatus);
    });
  });
});
