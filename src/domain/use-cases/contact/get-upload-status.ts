import { GetUploadStatusUseCase } from "../../interfaces/use-cases/contact/get-upload-status";
import { ContactRepository } from "../../interfaces/repositories/contact-repository";

export class GetUploadStatus implements GetUploadStatusUseCase {
  contactRepository: ContactRepository;

  constructor(contactRepository: ContactRepository) {
    this.contactRepository = contactRepository;
  }

  async execute(accessToken: string, activityId: string): Promise<string> {
    return await this.contactRepository.getUploadStatus(
      accessToken,
      activityId,
    );
  }
}
