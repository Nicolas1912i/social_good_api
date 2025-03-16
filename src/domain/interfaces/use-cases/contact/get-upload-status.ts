export interface GetUploadStatusUseCase {
  execute(accessToken: string, activityId: string): Promise<string>;
}
