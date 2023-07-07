import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { VariantProps, cva } from "cva";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const card = cva("p-4 rounded-lg border border-gray-300 w-full", {
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
      false: "",
    },
  },
  defaultVariants: {
    size: "full",
    shadow: true,
  },
});

interface CardType extends VariantProps<typeof card> {
  children: ReactNode;
}

function Card({ children, shadow, size }: CardType) {
  return <div className={twMerge(card({ size, shadow }))}>{children}</div>;
}

function CardButton({
  children,
  ...buttonProps
}: {
  children: ReturnType<typeof Cog6ToothIcon>;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      {...buttonProps}
      className="hover:bg-gray-100 rounded-lg text-black w-9 h-9 inline-flex items-center justify-center outline-none ring-offset-white focus-visible:ring-2 ring-offset-2 ring-indigo-500/50"
    >
      <span className="w-5 h-5">{children}</span>
    </button>
  );
}

function CardHeader({
  children,
  button,
}: {
  children: ReactNode;
  button?: ReturnType<typeof CardButton>;
}) {
  return (
    <div className="inline-flex justify-between w-full">
      <div className="mb-4 space-y-1">{children}</div>

      {button}
    </div>
  );
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
Card.Button = CardButton;

export default Card;
