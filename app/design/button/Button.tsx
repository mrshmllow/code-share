"use client";

import { VariantProps, cva } from "cva";
import { m } from "framer-motion";
import { ReactNode, createContext } from "react";
import ButtonText from "./ButtonText";
import ButtonIcon from "./ButtonIcon";

export const button = cva(
  "px-4 min-w-fit min-h-[2.5rem] transform-gpu rounded-lg inline-flex transition-colors items-center justify-center outline-none ring-offset-slate-950 focus-visible:ring-2 ring-offset-2",
  {
    variants: {
      intent: {
        secondary: "border-slate-300 border",
        primary: "border-slate-700 border",
      },
      isBusy: {
        true: "cursor-progress",
        false: "",
      },
      disabled: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        isBusy: false,
        disabled: false,
        className: "hover:brightness-95",
      },

      {
        intent: "secondary",
        isBusy: true,
        className: "text-slate-700",
      },
      {
        intent: "secondary",
        isBusy: false,
        disabled: false,
        className: "hover:text-slate-950",
      },
      {
        intent: "secondary",
        className: "from-slate-100 to-slate-200 bg-gradient-to-br",
      },
      {
        intent: "secondary",
        disabled: true,
        className: "bg-slate-200 text-slate-700",
      },
      {
        intent: "secondary",
        disabled: false,
        className: "bg-slate-200 text-black",
      },
      {
        intent: "primary",
        isBusy: true,
        className: "text-slate-300",
      },
      {
        intent: "primary",
        isBusy: false,
        disabled: false,
        className: "hover:text-slate-50",
      },
      {
        intent: "primary",
        disabled: true,
        className: "bg-slate-800 text-slate-300",
      },
      {
        intent: "primary",
        disabled: false,
        className: "from-slate-900 to-slate-800 bg-gradient-to-br text-white",
      },
    ],
    defaultVariants: {
      intent: "primary",
      isBusy: false,
      disabled: false,
    },
  }
);

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
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
        className={button({ intent, isBusy: busy, disabled })}
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
