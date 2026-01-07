import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Preços" },
  { href: "/history", label: "Histórico" },
  { href: "/favorites", label: "Favoritos" },
];

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, var(--accent) 0%, #22c55e 100%)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "bold",
            color: "var(--bg-primary)",
          }}>
            GE
          </div>
          <span style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}>
            GE Tracker
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{
          flex: 1,
          maxWidth: "480px",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}>
            <svg
              style={{
                position: "absolute",
                left: "14px",
                width: "18px",
                height: "18px",
                color: "var(--text-muted)",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar itens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 16px 10px 44px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                color: "var(--text-primary)",
                fontSize: "14px",
                transition: "var(--transition)",
              }}
            />
          </div>
        </form>

        {/* Navigation */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: isActive ? "var(--accent-dim)" : "transparent",
                  transition: "var(--transition)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
