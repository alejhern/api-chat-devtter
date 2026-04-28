import dotenv from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

if (!getApps().length) {
  const privateKey = process.env.private_key?.replace(/\\n/g, "\n");

  if (!privateKey) {
    throw new Error("Missing Firebase private key");
  }

  initializeApp({
    credential: cert({
      projectId: process.env.project_id,
      clientEmail: process.env.client_email,
      privateKey,
    }),
  });
}

export const auth = getAuth();
