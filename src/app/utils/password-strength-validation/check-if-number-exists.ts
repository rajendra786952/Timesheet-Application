import { z } from 'zod';

const checkIfNumberExists = (password: string) => {
  const numberSchema = z.string().regex(/\d/);
  return numberSchema.safeParse(password).success;
};

export default checkIfNumberExists;
