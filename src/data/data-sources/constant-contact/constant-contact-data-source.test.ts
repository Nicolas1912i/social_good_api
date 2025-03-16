import { BulkActivitiesApi, Configuration, ContactListsApi, ContactsApi } from "ctct-api-client";
import { ConstantContactDataSource } from "./constant-contact-data-source";

jest.mock("ctct-api-client");

describe("ConstantContactDataSource", () => {
  let dataSource: ConstantContactDataSource;
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    dataSource = new ConstantContactDataSource();
    jest.clearAllMocks();
  });

  describe("getConfiguration", () => {
    it("should create a Configuration with the provided access token", () => {
      // Using private method through reflection
      const config = (dataSource as any).getConfiguration(mockAccessToken);

      expect(config).toBeInstanceOf(Configuration);
      expect(Configuration).toHaveBeenCalledWith({ accessToken: mockAccessToken });
    });
  });

  describe("createCollection", () => {
    it("should create import JSON activity with correct list IDs", async () => {
      const mockContacts = [{ email: "test@example.com" }];
      const mockActivityId = "mock-activity-id";
      const mockListIds = ["list-1", "list-2"];

      // Mock the ContactListsApi response
      (ContactListsApi.prototype.getAllLists as jest.Mock).mockResolvedValue({
        data: {
          lists: mockListIds.map(id => ({ list_id: id }))
        }
      });

      // Mock the BulkActivitiesApi response
      (BulkActivitiesApi.prototype.createImportJSONActivity as jest.Mock).mockResolvedValue({
        data: {
          activity_id: mockActivityId
        }
      });

      const result = await dataSource.createCollection(mockContacts, mockAccessToken);

      // Verify ContactListsApi was called with correct configuration
      expect(ContactListsApi).toHaveBeenCalledWith(expect.any(Configuration));
      expect(ContactListsApi.prototype.getAllLists).toHaveBeenCalled();

      // Verify BulkActivitiesApi was called with correct parameters
      expect(BulkActivitiesApi).toHaveBeenCalledWith(expect.any(Configuration));
      expect(BulkActivitiesApi.prototype.createImportJSONActivity).toHaveBeenCalledWith({
        import_data: mockContacts,
        list_ids: mockListIds
      });

      expect(result).toBe(mockActivityId);
    });

    it("should throw error when ContactListsApi fails", async () => {
      const mockContacts = [{ email: "test@example.com" }];

      // Mock the ContactListsApi to throw an error
      (ContactListsApi.prototype.getAllLists as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.createCollection(mockContacts, mockAccessToken)).rejects.toThrow();
    });

    it("should throw specific error when BulkActivitiesApi fails", async () => {
      const mockContacts = [{ email: "test@example.com" }];
      const mockListIds = ["list-1"];

      // Mock the ContactListsApi successful response
      (ContactListsApi.prototype.getAllLists as jest.Mock).mockResolvedValue({
        data: {
          lists: mockListIds.map(id => ({ list_id: id }))
        }
      });

      // Mock the BulkActivitiesApi to throw an error
      (BulkActivitiesApi.prototype.createImportJSONActivity as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.createCollection(mockContacts, mockAccessToken)).rejects.toThrow("Failed to import JSON");
    });

    it("should handle empty list IDs", async () => {
      const mockContacts = [{ email: "test@example.com" }];
      const mockActivityId = "mock-activity-id";

      // Mock the ContactListsApi with empty lists
      (ContactListsApi.prototype.getAllLists as jest.Mock).mockResolvedValue({
        data: {
          lists: []
        }
      });

      // Mock the BulkActivitiesApi response
      (BulkActivitiesApi.prototype.createImportJSONActivity as jest.Mock).mockResolvedValue({
        data: {
          activity_id: mockActivityId
        }
      });

      const result = await dataSource.createCollection(mockContacts, mockAccessToken);

      expect(BulkActivitiesApi.prototype.createImportJSONActivity).toHaveBeenCalledWith({
        import_data: mockContacts,
        list_ids: []
      });
      expect(result).toBe(mockActivityId);
    });
  });

  describe("getAll", () => {
    it("should get all contacts with correct parameters", async () => {
      const mockContacts = [{ email: "test@example.com" }];

      (ContactsApi.prototype.getAllContacts as jest.Mock).mockResolvedValue({
        data: {
          contacts: mockContacts
        }
      });

      const result = await dataSource.getAll(mockAccessToken);

      expect(ContactsApi).toHaveBeenCalledWith(expect.any(Configuration));
      expect(ContactsApi.prototype.getAllContacts).toHaveBeenCalledWith(
        undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined, undefined,
        "street_addresses,phone_numbers", undefined, undefined, 500
      );
      expect(result).toEqual(mockContacts);
    });

    it("should throw specific error when ContactsApi fails", async () => {
      (ContactsApi.prototype.getAllContacts as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.getAll(mockAccessToken)).rejects.toThrow("Failed to retrieve contacts");
    });

    it("should handle empty contacts result", async () => {
      (ContactsApi.prototype.getAllContacts as jest.Mock).mockResolvedValue({
        data: {
          contacts: []
        }
      });

      const result = await dataSource.getAll(mockAccessToken);
      expect(result).toEqual([]);
    });
  });

  describe("getUploadStatus", () => {
    it("should get activity status with correct parameters", async () => {
      const mockActivityId = "mock-activity-id";
      const mockState = "COMPLETE";

      (BulkActivitiesApi.prototype.getActivityById as jest.Mock).mockResolvedValue({
        data: {
          state: mockState
        }
      });

      const result = await dataSource.getUploadStatus(mockAccessToken, mockActivityId);

      expect(BulkActivitiesApi).toHaveBeenCalledWith(expect.any(Configuration));
      expect(BulkActivitiesApi.prototype.getActivityById).toHaveBeenCalledWith(mockActivityId);
      expect(result).toBe(mockState);
    });

    it("should throw specific error when BulkActivitiesApi fails", async () => {
      const mockActivityId = "mock-activity-id";

      (BulkActivitiesApi.prototype.getActivityById as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.getUploadStatus(mockAccessToken, mockActivityId)).rejects.toThrow("Failed to retrieve upload status");
    });

    it("should handle null state result", async () => {
      const mockActivityId = "mock-activity-id";

      (BulkActivitiesApi.prototype.getActivityById as jest.Mock).mockResolvedValue({
        data: {
          state: null
        }
      });

      await expect(dataSource.getUploadStatus(mockAccessToken, mockActivityId)).resolves.toBeNull();
    });
  });
});