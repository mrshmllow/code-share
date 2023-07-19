import { VariantProps, cva } from "cva";
import { ReactNode, forwardRef } from "react";

export const textInput = cva(
  "px-4 min-h-[2.5rem] rounded-lg inline-flex items-center gap-3 outline-none ring-offset-white focus-visible:ring-2 ring-offset-2 border-gray-300 border text-gray-900 [&:has(:focus-visible)]:border-indigo-500 bg-gray-100 [&:has(:focus-visible)]:bg-white disabled:opacity-90",
  {
    variants: {
      full: {
        true: "w-full",
      },
    },
    defaultVariants: {
      full: false,
    },
  }
);

interface TextInputProps
  extends React.ComponentPropsWithoutRef<"input">,
    VariantProps<typeof textInput> {
  icon?: ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function (
  { disabled, icon, full, className, ...extra },
  ref
) {
  return (
    <div className={textInput({ full, className })}>
      {icon !== undefined && (
        <span className="w-6 h-6 inline-flex items-center">{icon}</span>
      )}

      <input
        type="text"
        ref={ref}
        className="bg-inherit outline-none placeholder:text-gray-400 w-full"
        disabled={disabled !== null ? disabled : undefined}
        {...extra}
      />
    </div>
  );
});
TextInput.displayName = "TextInput";

export default TextInput;
