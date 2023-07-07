import { VariantProps, cva } from "cva";

const textArea = cva(
  "px-4 py-4 min-h-[2.5rem] rounded-lg inline-flex items-center gap-3 outline-none ring-offset-gray-150 focus-visible:ring-2 ring-offset-2 border-gray-300 border text-gray-700 [&:has(:focus)]:border-blue-500",
  {
    variants: {
      disabled: {
        true: "bg-gray-200",
        false:
          "hover:brightness-95 hover:text-gray-950 from-gray-100 to-gray-200 bg-gradient-to-br",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "disabled">,
    VariantProps<typeof textArea> {}

export default function TextArea({ disabled, ...extra }: TextAreaProps) {
  return (
    <div className={textArea({ disabled })}>
      <textarea
        className="bg-inherit outline-none placeholder:text-gray-600"
        disabled={disabled !== null ? disabled : undefined}
        {...extra}
      />
    </div>
  );
}
