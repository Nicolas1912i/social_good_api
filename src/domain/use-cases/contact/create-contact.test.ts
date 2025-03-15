import {CreateContact} from "./create-contact";
import {ContactRepository} from "../../interfaces/repositories/contact-repository";

describe("CreateContact", () => {
  let useCase: CreateContact;
  let mockRepository: jest.Mocked<ContactRepository>;
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    mockRepository = {
      createCollection: jest.fn(),
      getContacts: jest.fn(),
      getUploadStatus: jest.fn()
    };
    useCase = new CreateContact(mockRepository);
  });

  describe("execute", () => {
    it("should call repository createCollection method", async () => {
      const mockContacts = [{ email: "test@example.com" }];
      const mockActivityId = "mock-activity-id";

      mockRepository.createCollection.mockResolvedValue(mockActivityId);

      const result = await useCase.execute(mockContacts, mockAccessToken);

      expect(mockRepository.createCollection).toHaveBeenCalledWith(mockContacts, mockAccessToken);
      expect(result).toBe(mockActivityId);
    });
  });
});