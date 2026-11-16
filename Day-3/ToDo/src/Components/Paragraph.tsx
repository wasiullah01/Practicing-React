import type { ReactNode } from "react";

type ParagraphProps = {
  children: ReactNode;
};

function Paragraph({ children }: ParagraphProps) {
  return <p>{children}</p>;
}

export default Paragraph;
