import bcrypt from 'bcryptjs';


/**
 * Hashes and salts a password using bcrypt.
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds for bcrypt (default is 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function saltAndHashPassword(
  password: string,
  saltRounds: number
): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
}

// This function is used to check if a password is valid by comparing it to a hashed password.
export async function isPasswordValid(
  givenPassword: string,
  hashedPassword: string
) {
  try {
    const isValid = await bcrypt.compare(givenPassword, hashedPassword);
    return isValid;
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error}`);
  }
}
