export type TypographyVariantPrefixOption = 'lg' | 'md' | 'rg' | 'rg1' |'sm';
export type TypographyVariantOption = 'Regular' | 'Medium' | 'SemiBold';
export type TypographyObjectKeyOption = `${TypographyVariantPrefixOption}${TypographyVariantOption}`;
export type TypographyVariantObject = Record<TypographyObjectKeyOption, Record<string, string>>;

// TODO: Remove enum and replace it with "as const"
export enum CustomColorSchemeKeys {
  primary = 'primary',
  neutral = 'neutral',
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  purple = 'purple',
}
