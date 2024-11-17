import bcrypt from 'bcrypt';

/**
 * Hashes and salts a password using bcrypt.
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds for bcrypt (default is 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function saltAndHashPassword(password: string, saltRounds: number = 10): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
}
