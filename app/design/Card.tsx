import { VariantProps, cva } from "cva";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const card = cva(
  "p-4 rounded-lg border border-gray-300 w-full",
  {
    variants: {
      size: {
        fit: "",
        full: "w-full",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
      shadow: {
        true: "shadow-lg sm:shadow-xl",
        false: ""
      }
    },
    defaultVariants: {
      size: "full",
      shadow: true
    },
  }
);

interface CardType extends VariantProps<typeof card> {
  children: ReactNode;
}

function Card({ children, shadow, size }: CardType) {
  return <div className={twMerge(card({ size, shadow }))}>{children}</div>;
}

function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4 space-y-1">{children}</div>;
}

function CardTitle({ children }: { children: ReactNode }) {
  return <header className="font-bold text-lg">{children}</header>;
}

function CardSubtitle({ children }: { children: ReactNode }) {
  return <p className="text-gray-700">{children}</p>;
}

Card.Title = CardTitle;
Card.Header = CardHeader;
Card.Subtitle = CardSubtitle;

export default Card;
