import { z } from 'zod';

const checkIfSpecialCharacterExists = (password: string) => {
  const specialCharacterSchema = z.string().regex(/[^a-zA-Z0-9]/);
  return specialCharacterSchema.safeParse(password).success;
};

export default checkIfSpecialCharacterExists;
