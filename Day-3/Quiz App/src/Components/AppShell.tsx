import type { ReactNode } from "react";
import styles from "./AppShell.module.css";

type AppShellProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

function AppShell({
  eyebrow = "Quiz challenge",
  title,
  subtitle,
  children,
}: AppShellProps) {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        {children}
      </section>
    </main>
  );
}

export default AppShell;