export const PASSWORD_STRENGTH_KEYS = {
  minChars: 'minChars',
  oneUppercase: 'oneUppercase',
  oneNum: 'oneNum',
  oneSpecialChar: 'oneSpecialChar',
} as const;

export type PasswordStrengthKey = keyof typeof PASSWORD_STRENGTH_KEYS;

export type StrengthItem = {
  key: PasswordStrengthKey;
  label: string;
  active: boolean;
  error: boolean;
  fulfills: boolean;
  count?: number;
};

export type PasswordStrengthOptions = {
  minChars?: number;
  minCharsLabel?: string;
  oneUppercase?: boolean;
  oneUppercaseLabel?: string;
  oneNum?: boolean;
  oneNumLabel?: string;
  oneSpecialChar?: boolean;
  oneSpecialCharLabel?: string;
};

export type PasswordStrengthProps = {
  password: string;
  options: PasswordStrengthOptions;
  error?: PasswordStrengthKey;
};
