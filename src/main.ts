import server from './server'
import ContactRouter from './presentation/routers/contact-router'
import { GetAllContacts } from './domain/use-cases/contact/get-all-contacts'
import { ContactRepositoryImpl } from './domain/repositories/contact-repository'
import { CreateContact } from './domain/use-cases/contact/create-contact'
import {ConstantContactDataSource} from "./data/data-sources/constant-contact/constant-contact-data-source";

(async () => {

  const x = new ConstantContactDataSource();

  const contactMiddleWare = ContactRouter(
    new GetAllContacts(new ContactRepositoryImpl(x)),
    new CreateContact(new ContactRepositoryImpl(x)),
  )

  server.use("/", contactMiddleWare)
  server.listen(4000, () => console.log("Running on http://localhost:4000"))

})()