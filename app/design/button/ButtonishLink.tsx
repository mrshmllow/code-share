import { VariantProps } from "cva";
import Link from "next/link";
import { button } from "./button.cva";
import { ReactNode } from "react";
import { m } from "framer-motion";

const MotionLink = m(Link);

type LinkProps = React.ComponentProps<typeof MotionLink>;

interface ButtonishLinkProps extends LinkProps, VariantProps<typeof button> {
  children: ReactNode;
  animate?: boolean;
}

export default function ButtonishLink({
  intent,
  isBusy,
  disabled,
  full,
  children,
  animate,
  className,
  ...linkProps
}: ButtonishLinkProps) {
  return (
    <MotionLink
      className={button({
        isBusy,
        intent,
        disabled,
        full,
        className,
      })}
      whileTap={{
        scale: disabled || isBusy || animate === false ? 1 : 0.9,
      }}
      transition={{
        duration: 0.1,
      }}
      {...linkProps}
    >
      <span className="inline-flex items-center gap-3">{children}</span>
    </MotionLink>
  );
}
