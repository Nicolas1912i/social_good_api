import server from "./server";
import ContactRouter from "./presentation/routers/contact-router";
import { GetAllContacts } from "./domain/use-cases/contact/get-all-contacts";
import { ContactRepositoryImpl } from "./domain/repositories/contact-repository";
import { CreateContact } from "./domain/use-cases/contact/create-contact";
import { ConstantContactDataSource } from "./data/data-sources/constant-contact/constant-contact-data-source";
import { GetUploadStatus } from "./domain/use-cases/contact/get-upload-status";

(async () => {
  const constantContactDataSource = new ConstantContactDataSource();

  const contactMiddleWare = ContactRouter(
    new GetAllContacts(new ContactRepositoryImpl(constantContactDataSource)),
    new CreateContact(new ContactRepositoryImpl(constantContactDataSource)),
    new GetUploadStatus(new ContactRepositoryImpl(constantContactDataSource)),
  );

  server.use("/", contactMiddleWare);
  server.listen(4000, () => {});
})();
