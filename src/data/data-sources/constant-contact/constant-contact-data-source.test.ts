import { BulkActivitiesApi, ContactsApi } from "ctct-api-client";
import {ConstantContactDataSource} from "./constant-contact-data-source";

jest.mock("ctct-api-client");

describe("ConstantContactDataSource", () => {
  let dataSource: ConstantContactDataSource;
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    dataSource = new ConstantContactDataSource();
    jest.clearAllMocks();
  });

  describe("createCollection", () => {
    it("should create import JSON activity successfully", async () => {
      const mockContacts = [{ email: "test@example.com" }];
      const mockActivityId = "mock-activity-id";

      (BulkActivitiesApi.prototype.createImportJSONActivity as jest.Mock).mockResolvedValue({
        data: {
          activity_id: mockActivityId
        }
      });

      const result = await dataSource.createCollection(mockContacts, mockAccessToken);

      expect(BulkActivitiesApi.prototype.createImportJSONActivity).toHaveBeenCalledWith({
        import_data: mockContacts,
        list_ids: ["a2d739ee-fc29-11ef-bfc7-fa163ea51378"]
      });
      expect(result).toBe(mockActivityId);
    });

    it("should throw error when import JSON fails", async () => {
      const mockContacts = [{ email: "test@example.com" }];

      (BulkActivitiesApi.prototype.createImportJSONActivity as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.createCollection(mockContacts, mockAccessToken)).rejects.toThrow("Failed to import JSON");
    });
  });

  describe("getAll", () => {
    it("should get all contacts successfully", async () => {
      const mockContacts = [{ email: "test@example.com" }];

      (ContactsApi.prototype.getAllContacts as jest.Mock).mockResolvedValue({
        data: {
          contacts: mockContacts
        }
      });

      const result = await dataSource.getAll(mockAccessToken);

      expect(ContactsApi.prototype.getAllContacts).toHaveBeenCalled();
      expect(result).toEqual(mockContacts);
    });

    it("should throw error when get all contacts fails", async () => {
      (ContactsApi.prototype.getAllContacts as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.getAll(mockAccessToken)).rejects.toThrow("Failed to retrieve contacts");
    });
  });

  describe("getUploadStatus", () => {
    it("should get activity status successfully", async () => {
      const mockActivityId = "mock-activity-id";
      const mockState = "COMPLETE";

      (BulkActivitiesApi.prototype.getActivityById as jest.Mock).mockResolvedValue({
        data: {
          state: mockState
        }
      });

      const result = await dataSource.getUploadStatus(mockAccessToken, mockActivityId);

      expect(BulkActivitiesApi.prototype.getActivityById).toHaveBeenCalledWith(mockActivityId);
      expect(result).toBe(mockState);
    });

    it("should throw error when get activity status fails", async () => {
      const mockActivityId = "mock-activity-id";

      (BulkActivitiesApi.prototype.getActivityById as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(dataSource.getUploadStatus(mockAccessToken, mockActivityId)).rejects.toThrow("Failed to retrieve upload status");
    });
  });
});