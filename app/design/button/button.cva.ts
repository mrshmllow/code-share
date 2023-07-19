import { cva } from "cva";

export const button = cva(
  "px-4 min-h-[2.5rem] transform-gpu rounded-lg inline-flex transition-all items-center justify-center outline-none ring-offset-white focus-visible:ring-2 ring-offset-2 ring-indigo-500/50",
  {
    variants: {
      intent: {
        secondary:
          "border-indigo-300 text-indigo-800 hover:text-indigo-800 from-indigo-50 to-indigo-100 bg-gradient-to-br border",
        primary:
          "border-indigo-700 text-white from-indigo-500 to-indigo-600 bg-gradient-to-br border",
      },
      disabled: {
        true: "opacity-90 border-none",
        false: "",
      },
      full: {
        sm: "w-full sm:min-w-fit",
        true: "w-full",
        false: "min-w-fit",
      },
    },
    compoundVariants: [
      {
        intent: "secondary",
        disabled: false,
        className: "hover:from-indigo-200 hover:to-indigo-300",
      },

      {
        intent: "primary",
        disabled: false,
        className: "hover:from-indigo-600 hover:to-indigo-700",
      },
    ],
    defaultVariants: {
      intent: "primary",
      disabled: false,
      full: false,
    },
  }
);
