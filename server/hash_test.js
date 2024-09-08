const bcrypt = require("bcryptjs");

const password = "123"; // The password to test
const storedHash =
  "$2a$10$LPtV37echDH1OiYzIlcK2.OO6uO1G7KQlKAzbjW2pXik9.5dPEcE2"; // Replace with the hash from the previous step

async function comparePassword() {
  try {
    const isMatch = await bcrypt.compare(password, storedHash);
    console.log("Password match result:", isMatch); // Should be true if passwords match
  } catch (error) {
    console.error("Comparison error:", error);
  }
}

comparePassword();
