import { VariantProps, cva } from "cva";
import { ReactNode } from "react";

const card = cva("bg-slate-900 p-4 rounded-lg border border-slate-700", {
  variants: {
    size: {
      fit: "",
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

export default function Card({ children, size }: CardType) {
  return <div className={card({ size })}>{children}</div>;
}
