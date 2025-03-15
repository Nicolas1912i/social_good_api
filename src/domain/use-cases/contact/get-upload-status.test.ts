import {GetUploadStatus} from "./get-upload-status";
import {ContactRepository} from "../../interfaces/repositories/contact-repository";

describe("GetUploadStatus", () => {
  let useCase: GetUploadStatus;
  let mockRepository: jest.Mocked<ContactRepository>;
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    mockRepository = {
      createCollection: jest.fn(),
      getContacts: jest.fn(),
      getUploadStatus: jest.fn()
    };
    useCase = new GetUploadStatus(mockRepository);
  });

  describe("execute", () => {
    it("should call repository getUploadStatus method", async () => {
      const mockActivityId = "mock-activity-id";
      const mockStatus = "COMPLETE";

      mockRepository.getUploadStatus.mockResolvedValue(mockStatus);

      const result = await useCase.execute(mockAccessToken, mockActivityId);

      expect(mockRepository.getUploadStatus).toHaveBeenCalledWith(mockAccessToken, mockActivityId);
      expect(result).toBe(mockStatus);
    });
  });
});