import "./admin.css";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div lang="th" className="risa-admin min-h-screen bg-paper text-ink">{children}</div>;
}
