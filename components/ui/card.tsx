import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <section className={`rounded-xl border bg-white p-4 shadow-sm ${className ?? ""}`}>
      {children}
    </section>
  );
}
