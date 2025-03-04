import bcrypt from "bcrypt";

/**
 * Hash a password before storing it in the database.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} Hashed password.
 */
export const hashPassword = async (password) => {
  const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} password - The plain text password entered by the user.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
