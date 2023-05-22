import { ReactNode } from "react";

export default function Form({
  children,
  ...extra
}: { children: ReactNode } & React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className="grid [&>div]:mb-2 group/form" {...extra}>
      {children}
    </form>
  );
}
