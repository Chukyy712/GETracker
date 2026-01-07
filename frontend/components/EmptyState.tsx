import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-lg)",
        padding: "64px 32px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "var(--accent-dim)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}
      >
        {icon}
      </div>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          maxWidth: "400px",
          margin: "0 auto 24px",
        }}
      >
        {description}
      </p>
      {action && (
        <a href={action.href} className="btn btn-primary">
          {action.label}
        </a>
      )}
    </div>
  );
}
