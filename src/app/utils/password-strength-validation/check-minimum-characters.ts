import { z } from 'zod';

const checkMinimumCharacters = (password: string, minChars?: number) => {
  if (!minChars) return true;
  const checkMinimumCharactersSchema = z.string().min(minChars);
  return checkMinimumCharactersSchema.safeParse(password).success;
};

export default checkMinimumCharacters;
