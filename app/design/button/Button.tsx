"use client";

import { VariantProps, cva } from "cva";
import { m } from "framer-motion";
import { ReactNode, createContext } from "react";
import ButtonText from "./ButtonText";
import ButtonIcon from "./ButtonIcon";

const button = cva(
  "px-4 min-w-fit min-h-[2.5rem] transform-gpu rounded-lg inline-flex transition-colors items-center justify-center outline-none ring-offset-slate-950 focus-visible:ring-2 ring-offset-2",
  {
    variants: {
      intent: {
        secondary:
          "border-slate-300 border text-slate-700 disabled:bg-slate-200",
        primary: "border-slate-700 border text-slate-300 disabled:bg-slate-800",
      },
      isBusy: {
        true: "cursor-progress",
        false: "",
      },
    },
    compoundVariants: [
      {
        isBusy: false,
        className: "hover:brightness-95 disabled:hover:brightness-100",
      },

      {
        intent: "secondary",
        isBusy: true,
        className: "text-slate-700",
      },
      {
        intent: "secondary",
        isBusy: false,
        className: "hover:text-slate-950 disabled:hover:text-inherit",
      },
      {
        intent: "secondary",
        className: "from-slate-100 to-slate-200 bg-gradient-to-br",
      },
      {
        intent: "primary",
        isBusy: true,
        className: "text-slate-300",
      },
      {
        intent: "primary",
        isBusy: false,
        className: "hover:text-slate-50 disabled:hover:text-inherit",
      },
      {
        intent: "primary",
        className: "from-slate-900 to-slate-800 bg-gradient-to-br",
      },
    ],
    defaultVariants: {
      intent: "primary",
      isBusy: false,
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof button> {
  children: ReactNode;
  busy?: boolean;
}

export const ButtonContext = createContext({
  busy: false,
});

function Button({ children, intent, busy, disabled, ...extra }: ButtonProps) {
  return (
    <ButtonContext.Provider
      value={{
        busy: busy !== undefined ? busy : false,
      }}
    >
      <m.button
        className={button({ intent, isBusy: busy })}
        whileTap={{
          scale: disabled ? 1 : 0.9,
        }}
        transition={{
          duration: 0.1,
        }}
        disabled={disabled ? disabled : undefined}
        onClick={extra.onClick}
      >
        <span className="inline-flex items-center gap-3">{children}</span>
      </m.button>
    </ButtonContext.Provider>
  );
}

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export default Button;
