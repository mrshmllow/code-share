import { ReactNode, useContext } from "react";
import { ButtonContext } from "./Button";
import { m } from "framer-motion";
import { cva } from "cva";

const span = cva("w-5 h-5 inline-flex items-center");

export default function ButtonIcon({
  children,
  busyIcon,
}: {
  children: ReactNode;
  busyIcon?: ReactNode;
}) {
  const { busy } = useContext(ButtonContext);

  return busy && busyIcon !== undefined ? (
    <m.span
      className={span()}
      initial={{
        scale: .5,
      }}
      animate={{
        scale: 1,
      }}
    >
      {busyIcon}
    </m.span>
  ) : (
    <span className={span()}>{children}</span>
  );
}
