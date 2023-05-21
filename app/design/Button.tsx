"use client";

import { VariantProps, cva } from "cva";
import { m } from "framer-motion";
import { ReactNode, createContext, useState } from "react";
import ButtonText from "./ButtonText";
import ButtonBusyText from "./ButtonBusyText";

const button = cva(
  "px-4 min-w-[8rem] transform-gpu py-2 rounded-lg inline-flex justify-center relative transition-colors",
  {
    variants: {
      intent: {
        secondary:
          "from-slate-100 to-slate-200 bg-gradient-to-br border-slate-300 border text-slate-700",
        primary:
          "from-slate-900 to-slate-800 bg-gradient-to-br border-slate-700 border text-slate-300",
      },
      isBusy: {
        true: "cursor-progress",
        false: "hover:brightness-95",
      },
    },
    compoundVariants: [
      {
        intent: "secondary",
        isBusy: true,
        className: "text-slate-700",
      },
      {
        intent: "secondary",
        isBusy: false,
        className: "hover:text-slate-950",
      },
      {
        intent: "primary",
        isBusy: true,
        className: "text-slate-300",
      },
      {
        intent: "primary",
        isBusy: false,
        className: " hover:text-slate-50",
      },
    ],
    defaultVariants: {
      intent: "primary",
      isBusy: false,
    },
  }
);

interface ButtonProps extends VariantProps<typeof button> {
  children: ReactNode;
}

export const ButtonContext = createContext({
  busy: false,
});

function Button({ children, intent }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <ButtonContext.Provider
      value={{
        busy: loading,
      }}
    >
      <m.button
        className={button({ intent, isBusy: loading })}
        onClick={() => setLoading((loading) => !loading)}
        whileTap={{
          scale: 0.9,
        }}
        transition={{
          duration: 0.1,
        }}
      >
        {children}
      </m.button>
    </ButtonContext.Provider>
  );
}

Button.Text = ButtonText;
Button.BusyText = ButtonBusyText;

export default Button;
