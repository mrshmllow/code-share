import { VariantProps, cva } from "cva";
import { ReactNode } from "react";

const textInput = cva(
  "px-4 min-h-[2.5rem] rounded-lg inline-flex items-center gap-3 outline-none ring-offset-slate-950 focus-visible:ring-2 ring-offset-2 border-slate-700 border text-slate-300 [&:has(:focus)]:border-blue-500",
  {
    variants: {
      disabled: {
        true: "bg-slate-800",
        false:
          "hover:brightness-95 hover:text-slate-50 from-slate-900 to-slate-800 bg-gradient-to-br",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "disabled">,
  VariantProps<typeof textInput> {
  icon?: ReactNode;
}

export default function TextInput({
  disabled,
  icon,
  ...extra
}: TextInputProps) {
  return (
    <div className={textInput({ disabled })}>
      {icon !== undefined && (
        <span className="w-6 h-6 inline-flex items-center">{icon}</span>
      )}

      <input
        type="text"
        className="bg-inherit outline-none placeholder:text-slate-400"
        disabled={disabled !== null ? disabled : undefined}
        {...extra}
      />
    </div>
  );
}
