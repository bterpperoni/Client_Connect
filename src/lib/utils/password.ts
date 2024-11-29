import * as bcrypt from 'bcryptjs';


/**
 * Hashes and salts a password using bcrypt.
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds for bcrypt (default is 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function saltAndHashPassword(
  password: string,
  saltRounds: number = 12
): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
}

// This function is used to check if a password is valid by comparing it to a hashed password.
export async function isPasswordValid(
  password: string,
  hashedPassword: string
) {
  try {
    const passwordInput = await saltAndHashPassword(password);
    const isValid = await bcrypt.compare(passwordInput, hashedPassword);
    return isValid;
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error}`);
  }
}
