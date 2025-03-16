import { GetAllContacts } from "./get-all-contacts";
import { ContactRepository } from "../../interfaces/repositories/contact-repository";

describe("GetAllContacts", () => {
  let useCase: GetAllContacts;
  let mockRepository: jest.Mocked<ContactRepository>;
  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    mockRepository = {
      createCollection: jest.fn(),
      getContacts: jest.fn(),
      getUploadStatus: jest.fn(),
    };
    useCase = new GetAllContacts(mockRepository);
  });

  describe("execute", () => {
    it("should call repository getContacts method", async () => {
      const mockContacts = [
        { contact_id: "123", email_address: { address: "test@example.com" } },
      ];

      mockRepository.getContacts.mockResolvedValue(mockContacts);

      const result = await useCase.execute(mockAccessToken);

      expect(mockRepository.getContacts).toHaveBeenCalledWith(mockAccessToken);
      expect(result).toEqual(mockContacts);
    });
  });
});
