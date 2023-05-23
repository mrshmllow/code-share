import { VariantProps } from "cva";
import Link from "next/link";
import { button } from "./Button";
import { ReactNode } from "react";
import { m } from "framer-motion";

const MotionLink = m(Link);

type LinkProps = React.ComponentProps<typeof MotionLink>;

interface ButtonishLinkProps
  extends LinkProps,
  VariantProps<typeof button> {
  children: ReactNode;
}

export default function ButtonishLink({
  intent,
  isBusy,
  disabled,
  full,
  ...linkProps
}: ButtonishLinkProps) {
  return (
    <MotionLink
      className={button({
        isBusy,
        intent,
        disabled,
        full
      })}
      whileTap={{
        scale: 0.9,
      }}
      transition={{
        duration: 0.1,
      }}
      {...linkProps}
    />
  );
}
