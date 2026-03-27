import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";
dotenv.config();

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
});

export default db;