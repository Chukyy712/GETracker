import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Preços" },
  { href: "/history", label: "Histórico" },
  { href: "/favorites", label: "Favoritos" },
];

export default function Footer() {
  return (
    <footer style={{
      marginTop: "auto",
      borderTop: "1px solid var(--border)",
      background: "var(--bg-secondary)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 24px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          {/* Logo & Copyright */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <div style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, var(--accent) 0%, #22c55e 100%)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: "var(--bg-primary)",
              }}>
                GE
              </div>
              <span style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}>
                GE Tracker
              </span>
            </div>
            <p style={{
              fontSize: "13px",
              color: "var(--text-muted)",
            }}>
              Rastreador de preços do Grand Exchange
            </p>
          </div>

          {/* Links */}
          <nav style={{
            display: "flex",
            gap: "24px",
          }}>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  transition: "var(--transition)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div style={{
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}>
          <p style={{
            fontSize: "13px",
            color: "var(--text-muted)",
          }}>
            Dados obtidos via OSRS Wiki API
          </p>
        </div>
      </div>
    </footer>
  );
}
