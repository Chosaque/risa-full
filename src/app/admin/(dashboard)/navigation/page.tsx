import { sql } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { NavItemsEditor, FooterLinksEditor } from "@/components/admin/NavigationEditor";

type NavRow = {
  id: string; label_th: string; label_en: string; href: string;
  parent_id: string | null; new_tab: boolean; status: string; sort: number;
};
type FooterRow = {
  id: string; column_key: string; label_th: string; label_en: string;
  href: string; new_tab: boolean; status: string; sort: number;
};

export default async function NavigationPage() {
  const [navItems, footerLinks] = await Promise.all([
    sql<NavRow[]>`select id, label_th, label_en, href, parent_id, new_tab, status, sort
        from nav_items order by sort asc, created_at asc`,
    sql<FooterRow[]>`select id, column_key, label_th, label_en, href, new_tab, status, sort
        from footer_links order by column_key, sort asc, created_at asc`,
  ]);

  return (
    <div>
      <PageHeader title="เมนูและฟุตเตอร์" description="จัดการเมนูหลักและลิงก์ในส่วนท้ายเว็บไซต์" />
      <div className="space-y-6">
        <NavItemsEditor items={navItems} />
        <FooterLinksEditor links={footerLinks} />
      </div>
    </div>
  );
}
