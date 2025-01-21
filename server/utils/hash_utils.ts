import bcrypt from "bcrypt";

export const gen_hash = async (password: string): Promise<string> => {
  const salt_round: number = 10;
  const salt: string = await bcrypt.genSalt(salt_round);
  const hash_password: string = await bcrypt.hash(password, salt);
  return hash_password;
};

export const cmp_password = async (
  hash_password: string,
  password: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash_password);
};
