import { getSettings } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="ตั้งค่าเว็บไซต์" description="ข้อมูลองค์กร แบรนด์ ช่องทางติดต่อ และแผนที่" />
      <SettingsForm initial={settings} />
    </div>
  );
}
