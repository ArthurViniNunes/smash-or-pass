type Props = { size?: number; className?: string };

export function BrandLogo({ size = 52, className }: Props) {
  return (
    <img
      src="/logo.svg"
      alt="Smash or Pass Recipes"
      width={size}
      className={className}
    />
  );
}