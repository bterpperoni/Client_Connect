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
    const salt = await bcrypt.genSalt(saltRounds).then((result) => {
      return result;
    })
    const hashedPassword = await bcrypt.hash(password, salt).then((result) => {
      return result;
    });
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
}


/**
 * Hashes and salts a password using bcrypt.
 * @param clearPassword - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against. 
 * @returns A promise that resolves a boolean.
 */
//! This function is used to check if a password is valid by comparing it to a hashed password.
export async function isPasswordValid(
  clearPassword: string,
  hashedPassword: string
) {
  try {
    const isValid = await bcrypt.compare(clearPassword, hashedPassword).then((result) => {
      return result;
    });
    if(isValid) 
    return isValid;
  } catch (error) {
    
  }
}
