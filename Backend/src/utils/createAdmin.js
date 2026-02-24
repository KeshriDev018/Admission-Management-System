import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existingAdmin = await User.findOne({
    email: adminEmail,
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Default admin created");
  } else {
    console.log("Admin already exists");
  }
};
