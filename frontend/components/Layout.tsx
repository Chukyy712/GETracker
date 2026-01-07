import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export default function Layout({ children, onSearch }: LayoutProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}>
      <Header onSearch={onSearch} />
      <main style={{
        flex: 1,
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        padding: "32px 24px",
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
