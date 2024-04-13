import { TypographyVariantObject, TypographyVariantPrefixOption } from '@/app/theme/types';

export default function generateTypographyVariants(
  common: Record<string, string>,
  prefix: TypographyVariantPrefixOption,
): TypographyVariantObject {
  const regularVariant: Record<string, string> = {
    ...common,
    fontWeight: '400',
  };

  const mediumVariant: Record<string, string> = {
    ...common,
    fontWeight: '500',
  };

  const semiBoldVariant: Record<string, string> = {
    ...common,
    fontWeight: '600',
  };

  const variantObject = {
    [`${prefix}Regular`]: regularVariant,
    [`${prefix}Medium`]: mediumVariant,
    [`${prefix}SemiBold`]: semiBoldVariant,
  } as unknown as TypographyVariantObject;

  return variantObject;
}
