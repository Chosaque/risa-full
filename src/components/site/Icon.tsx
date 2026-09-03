import {
  Award, BadgeCheck, BookOpen, Briefcase, Building2, Calendar, CalendarDays, CheckCircle2,
  CreditCard, Download, ExternalLink, FileText, FilePen, FlaskConical, GraduationCap,
  Handshake, ImageIcon, Landmark, Lightbulb, Mail, MapPin, Megaphone, MessageCircle,
  Microscope, Network, Percent, Phone, Ruler, Search, ShieldCheck, Sparkles, Star, Target,
  User, UserPlus, Users, Vote, Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Icons the admin can pick by name in any collection with an `icon` field. */
export const ICONS = {
  Award, BadgeCheck, BookOpen, Briefcase, Building2, Calendar, CalendarDays, CheckCircle2,
  CreditCard, Download, ExternalLink, FileText, FilePen, FlaskConical, GraduationCap,
  Handshake, Image: ImageIcon, Landmark, Lightbulb, Mail, MapPin, Megaphone, MessageCircle,
  Microscope, Network, Percent, Phone, Ruler, Search, ShieldCheck, Sparkles, Star, Target,
  User, UserPlus, Users, Vote, Wrench,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && ICONS[name as IconName]) || Sparkles;
  return <Cmp className={cn("size-5", className)} strokeWidth={1.7} aria-hidden />;
}
