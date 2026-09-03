export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full bg-surface text-ink">{children}</div>;
}
