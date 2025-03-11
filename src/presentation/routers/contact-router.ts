import express from 'express';
import {GetAllContactsUseCase} from "../../domain/interfaces/use-cases/contact/get-all-contacts";
import {CreateContactUseCase} from "../../domain/interfaces/use-cases/contact/create-contact";

export default function ContactsRouter(
    getAllContactsUseCase: GetAllContactsUseCase,
    createContactUseCase: CreateContactUseCase,
) {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const contacts = await getAllContactsUseCase.execute();
            res.send(contacts);
        } catch (error) {
            res.status(500).send({ message: "Error fetching data", error: error });
        }
    });

    router.post("/", async (req, res) => {
        try {
            await createContactUseCase.execute(req.body);
            res.statusCode = 201;
            res.json({ message: "Created" });
        } catch (error) {
            res.status(500).send({ message: "Error saving data", error: error });
        }
    });

    return router;
}