"use client";

import { VariantProps } from "cva";
import { m } from "framer-motion";
import { ReactNode, createContext } from "react";
import ButtonText from "./ButtonText";
import ButtonIcon from "./ButtonIcon";
import { button } from "./button.cva";
import { twMerge } from "tailwind-merge";

interface ButtonProps
  extends Omit<React.ComponentProps<typeof m.button>, "disabled">,
  VariantProps<typeof button> {
  children: ReactNode;
  animate?: boolean;
  isBusy?: boolean
}

export const ButtonContext = createContext({
  busy: false,
});

function Button({
  children,
  intent,
  isBusy,
  disabled,
  full,
  animate,
  className,
  ...extra
}: ButtonProps) {
  return (
    <ButtonContext.Provider
      value={{
        busy: isBusy !== undefined ? isBusy : false,
      }}
    >
      <m.button
        {...extra}
        className={twMerge(button({ intent, disabled: disabled ?? isBusy, full, className }))}
        whileTap={{
          scale: disabled || isBusy || animate === false ? 1 : 0.9,
        }}
        transition={{
          duration: 0.1,
        }}
        disabled={disabled ?? isBusy ?? undefined}
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
