import config from "../config/app.js";

import { connectDB } from "./admin.database.js";
import Admin from "../models/admin.model.js";
import { Crypto } from "../utils/hashed.js";

const crypto = new Crypto();

const nameAdmin = config.OWNER_USERNAME;
const adminPassword = config.OWNER_PASSWORD;

const ownerCreate = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: nameAdmin });
    if (existingAdmin) {
      console.log("Owner already exists");
      return;
    }

    const hashedPassword = await crypto.encrypt(adminPassword.toString());
    await Admin.create({
      username: nameAdmin,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("Created owner successfully");
  } catch (error) {
    console.error(`Error creating owner: ${error}`);
  } finally {
    process.exit();
  }
};

const main = async () => {
  await connectDB();
  await ownerCreate();
};

main();
