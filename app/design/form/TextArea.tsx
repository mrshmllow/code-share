import { VariantProps, cva } from "cva";

const textArea = cva(
  "px-4 py-4 min-h-[2.5rem] rounded-lg inline-flex items-center gap-3 outline-none ring-offset-slate-950 focus-visible:ring-2 ring-offset-2 border-slate-700 border text-slate-300 [&:has(:focus)]:border-blue-500",
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

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "disabled">,
  VariantProps<typeof textArea> { }

export default function TextArea({ disabled, ...extra }: TextAreaProps) {
  return (
    <div className={textArea({ disabled })}>
      <textarea
        className="bg-inherit outline-none placeholder:text-slate-400"
        disabled={disabled !== null ? disabled : undefined}
        {...extra}
      />
    </div>
  );
}
