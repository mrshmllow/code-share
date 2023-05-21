import { cx } from "cva";
import { ReactNode, useContext } from "react";
import { ButtonContext } from "./Button";

export default function ButtonText({ children }: { children: ReactNode }) {
  const { busy } = useContext(ButtonContext);

  return (
    <span
      className={cx(
        "transition-[opacity,transform] transform-gpu inline-flex justify-center items-center inset-0 absolute",
        busy
          ? "opacity-0 -translate-x-[1.1rem] pointer-events-none"
          : "opacity-100"
      )}
    >
      {children}
    </span>
  );
}
