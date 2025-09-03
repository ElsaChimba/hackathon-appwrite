import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68b70ff4003d646e69c9");

export const account = new Account(client);
export const databases = new Databases(client);
export { client, ID };
