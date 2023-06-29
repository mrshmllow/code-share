import { ReactNode, useContext } from "react";
import { ButtonContext } from "./Button";
import { m } from "framer-motion";
import { cva } from "cva";
import Spinner from "../icons/Spinner";

const span = cva("w-5 h-5 inline-flex items-center");

export default function ButtonIcon({
  children,
  busyIcon,
}: {
  children?: ReactNode;
  busyIcon?: ReactNode;
}) {
  const { busy } = useContext(ButtonContext);

  return busy ? (
    <m.span
      className={span()}
      initial={{
        scale: 0.5,
      }}
      animate={{
        scale: 1,
      }}
    >
      {busyIcon !== undefined ? busyIcon : <Spinner />}
    </m.span>
  ) : (
    <>{children && <span className={span()}>{children}</span>}</>
  );
}
