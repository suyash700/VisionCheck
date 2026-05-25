import Admin from "../models/Admin.js";

export const ensureDefaultAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "password";

  console.log("Checking default admin:", username);

  
  const existingAdmin = await Admin.findOne({ username });

  if (existingAdmin) {
    console.log("Admin already exists");
    return existingAdmin;
  }

  console.log("Creating default admin...");

  const admin = await Admin.create({
    username,
    password,
    role: "admin"
  });

  console.log("Admin created successfully");

  return admin;
};