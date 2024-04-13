import { z } from 'zod';

const checkIfUppercaseLetterExists = (password: string) => {
  const uppercaseLetterSchema = z.string().regex(/[A-Z]/);
  return uppercaseLetterSchema.safeParse(password).success;
};

export default checkIfUppercaseLetterExists;
