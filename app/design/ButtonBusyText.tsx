import { cx } from "cva";
import { useContext } from "react";
import { ButtonContext } from "./Button";
import { m } from "framer-motion";

export default function ButtonBusyText({
  children,
  modifier,
}: {
  children: string;
  modifier: string;
}) {
  const { busy } = useContext(ButtonContext);

  return (
    <m.span
      className={cx(
        "transition-[opacity,transform] transform-gpu inline-flex justify-center items-center",
        busy ? "opacity-100" : "opacity-0 translate-x-[1.1rem]"
      )}
      {...(busy ? { role: "progressbar" } : {})}
      aria-label="Loading Indicator"
      variants={{
        show: {
          transition: {
            staggerChildren: 0.03,
          },
        },
      }}
      animate={busy ? "show" : "hidden"}
    >
      <span>{children}</span>

      {modifier.split("").map((letter, index) => (
        <m.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
          }}
        >
          {letter}
        </m.span>
      ))}
    </m.span>
  );
}
