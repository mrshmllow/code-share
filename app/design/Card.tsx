import { VariantProps, cva } from "cva";
import { ReactNode } from "react";

const card = cva("bg-slate-900 p-4 rounded-lg border border-slate-700 w-full", {
  variants: {
    size: {
      fit: "",
      md: "max-w-md",
      lg: "max-w-lg",
    },
  },
  defaultVariants: {
    size: "fit",
  },
});

interface CardType extends VariantProps<typeof card> {
  children: ReactNode;
}

function Card({ children, size }: CardType) {
  return <div className={card({ size })}>{children}</div>;
}

function CardHeader({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 space-y-1">
      <header className="font-bold text-lg">{children}</header>
      {subtitle && <p className="text-slate-300">{subtitle}</p>}
    </div>
  );
}

Card.Header = CardHeader;

export default Card;
