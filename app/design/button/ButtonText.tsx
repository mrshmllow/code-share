import { cx } from "cva";
import { useContext } from "react";
import { ButtonContext } from "./Button";
import { m } from "framer-motion";

export default function ButtonText({
  children,
  busyText,
}: {
  children: string;
  busyText?: [string, string];
}) {
  const { busy } = useContext(ButtonContext);

  return (
    <span className="inline-flex relative">
      <span
        className={cx(
          "",
          busy && busyText !== undefined
            ? "opacity-0 -translate-x-[1.1rem] pointer-events-none"
            : "opacity-100",
          busyText !== undefined
            ? "transition-[opacity,transform] transform-gpu inline-flex justify-center items-center inset-0 absolute"
            : "w-full",
        )}
      >
        {children}
      </span>

      {busyText !== undefined && (
        <m.span
          className={cx(
            "transition-[opacity,transform] transform-gpu inline-flex justify-center items-center",
            busy ? "opacity-100" : "opacity-0 translate-x-[1.1rem]",
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
          <span>{busyText[0]}</span>

          {busyText[1].split("").map((letter, index, array) => (
            <m.span
              key={index}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },
              }}
              className={array[index + 1] === " " ? "pr-1" : undefined}
            >
              {letter}
            </m.span>
          ))}
        </m.span>
      )}
    </span>
  );
}
