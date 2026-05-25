import Admin from "../models/Admin.js";

export const seedAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.log("Admin credentials not found in environment variables");
      return;
    }

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    await Admin.create({
      username,
      password
    });

    console.log(`Admin '${username}' created successfully`);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
  }
};