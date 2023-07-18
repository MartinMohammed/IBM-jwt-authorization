import bcrypt from "bcrypt";

/**
 * Function responsible for hashing a payload using the bcrypt Blowfish algorithm.
 * @param payload - The string to be hashed.
 * @param workload - The number of rounds to hash the payload (default is 10).
 * @returns A promise resolving to the hashed string.
 */
async function bHash(payload: string, workload: number = 10): Promise<string> {
  // Perform any pre-save operations here

  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash the payload using the Blowfish algorithm with the generated salt
  return bcrypt.hash(payload, salt);
}

export default bHash;
