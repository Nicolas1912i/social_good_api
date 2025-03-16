import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GetAllContactsUseCase } from "@domain/interfaces/use-cases/contact/get-all-contacts";
import { CreateContactsUseCase } from "@domain/interfaces/use-cases/contact/create-contact";
import { GetUploadStatusUseCase } from "@domain/interfaces/use-cases/contact/get-upload-status";

export default function ContactsRouter(
  getAllContactsUseCase: GetAllContactsUseCase,
  createContactsUseCase: CreateContactsUseCase,
  getUploadStatusUseCase: GetUploadStatusUseCase,
) {
  dotenv.config();
  const router = express.Router();

  router.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  router.get("/authorize", async (req, res) => {
    const clientId = process.env.CLIENT_ID!;
    const redirectUrl = process.env.REDIRECT_URL!;

    const authUrl =
      "https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id={client_id}&redirect_uri={redirect_url}&response_type=token&state=NICK1912&nonce=NICK1912&scope=contact_data"
        .replace("{client_id}", clientId)
        .replace("{redirect_url}", redirectUrl);

    await fetch(authUrl).then((response) => {
      res.redirect(response.url);
    });
  });

  router.get("/contacts", async (req, res) => {
    const accessToken = req.query.access_token!.toString();
    try {
      const contacts = await getAllContactsUseCase.execute(accessToken);
      res.send(contacts);
    } catch (error) {
      res.status(500).send({ message: "Error fetching data", error: error });
    }
  });

  router.post("/contacts", async (req, res) => {
    const accessToken = req.query.access_token!.toString();
    try {
      const activity_id = await createContactsUseCase.execute(
        req.body,
        accessToken,
      );
      res.status(201).send({
        message: "Successfully started import process",
        activity_id: activity_id,
      });
    } catch (error) {
      res.status(500).send({ message: "Error saving data", error: error });
    }
  });

  router.get("/status", async (req, res) => {
    const accessToken = req.query.access_token!.toString();
    const activityId = req.query.activity_id!.toString();
    try {
      const status = await getUploadStatusUseCase.execute(
        accessToken,
        activityId,
      );
      res.status(200).send({ status: status });
    } catch (error) {
      res.status(500).send({ message: "Error saving data", error: error });
    }
  });

  return router;
}
