import { compare, hashSync, genSalt } from 'bcrypt';

/**
 * ! Hashes and salts a password using bcrypt.
 * @param password - The plain text password to hash.
 * @param saltRounds - The number of salt rounds for bcrypt (default is 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function saltAndHashPassword(password: string, saltRounds: number = 10): Promise<string> {
  try {
    const salt = await genSalt(saltRounds);
    const hashedPassword = hashSync(password, salt);
    const tempPassword = hashSync(password, salt);
    if( hashedPassword !== tempPassword ) { 
        throw new Error("Hash doesn't work"); 
    }
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error}`);
  }
}

//! This function is used to check if a password is valid by comparing it to a hashed password.
export async function isPasswordValid(
    password: string,
    hashedPassword: string
) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}
