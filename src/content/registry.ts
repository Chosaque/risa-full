/**
 * The content-key registry: the single source of truth for every fixed string
 * and image on the public site.
 *
 *  - `pnpm db:seed`            upserts these into `content_blocks`
 *  - `pnpm check:content-keys` fails if a <Editable k="…"> in the codebase is
 *                              missing here, or if a key here is unused.
 *
 * Adding a new headline to a page means adding one line here. Nothing on the
 * site is allowed to be a hard-coded string.
 */

export type BlockType = "text" | "richtext" | "image" | "url" | "number" | "icon";

export type BlockDef = {
  key: string;
  label: string;
  type?: BlockType;
  th: string;
  en: string;
};

export type SectionDef = { section: string; label: string; blocks: BlockDef[] };
export type PageDef = { page: string; label: string; path: string; sections: SectionDef[] };

const ORG_TH = "สมาคมส่งเสริมการวิจัยและมาตรฐานทางอุตสาหกรรม";
const ORG_EN = "Research and Industry Standards Advancement Association";

export const REGISTRY: PageDef[] = [
  // ───────────────────────────────────────────────────────────────── global
  {
    page: "global",
    label: "ส่วนกลาง (Header / Footer)",
    path: "/",
    sections: [
      {
        section: "header",
        label: "แถบเมนูด้านบน",
        blocks: [
          { key: "global.header.cta_label", label: "ปุ่ม CTA", th: "สมัครสมาชิก", en: "Become a member" },
          { key: "global.header.cta_href", label: "ลิงก์ปุ่ม CTA", type: "url", th: "/membership", en: "/membership" },
        ],
      },
      {
        section: "footer",
        label: "ส่วนท้ายเว็บไซต์",
        blocks: [
          { key: "global.footer.about_title", label: "หัวข้อคอลัมน์แนะนำ", th: "เกี่ยวกับสมาคม", en: "About RISA" },
          { key: "global.footer.about_body", label: "ข้อความแนะนำสมาคม", type: "richtext",
            th: "สมาคมส่งเสริมการวิจัยและมาตรฐานทางอุตสาหกรรม เชื่อมโยงนักวิจัย ภาคอุตสาหกรรม และหน่วยงานภาครัฐ เพื่อยกระดับงานวิจัยและมาตรฐานของประเทศไทย",
            en: "RISA connects researchers, industry and government to raise the standard of applied research and industrial practice in Thailand." },
          { key: "global.footer.menu_title", label: "หัวข้อคอลัมน์เมนู", th: "เมนูลัด", en: "Quick links" },
          { key: "global.footer.contact_title", label: "หัวข้อคอลัมน์ติดต่อ", th: "ติดต่อเรา", en: "Contact" },
          { key: "global.footer.address_title", label: "หัวข้อที่อยู่", th: "ที่ตั้งสำนักงาน", en: "Office" },
          { key: "global.footer.social_title", label: "หัวข้อโซเชียล", th: "ติดตามเรา", en: "Follow us" },
          { key: "global.footer.map_label", label: "ลิงก์แผนที่", th: "ดูแผนที่", en: "Open in maps" },
          { key: "global.footer.copyright", label: "ข้อความลิขสิทธิ์", th: "© 2568 สมาคมส่งเสริมการวิจัยและมาตรฐานทางอุตสาหกรรม สงวนลิขสิทธิ์", en: "© 2025 Research and Industry Standards Advancement Association. All rights reserved." },
        ],
      },
      {
        section: "cta",
        label: "แถบชวนสมัคร (ใช้ซ้ำหลายหน้า)",
        blocks: [
          { key: "global.cta.title", label: "หัวข้อ", th: "ร่วมเป็นส่วนหนึ่งของ RISA", en: "Join the RISA network" },
          { key: "global.cta.body", label: "คำอธิบาย", th: "เปิดรับนักวิจัย ผู้ประกอบการ และหน่วยงานที่ต้องการยกระดับมาตรฐานอุตสาหกรรมไทยร่วมกัน", en: "Open to researchers, companies and institutions working to raise Thai industrial standards." },
          { key: "global.cta.primary_label", label: "ปุ่มหลัก", th: "สมัครสมาชิก", en: "Become a member" },
          { key: "global.cta.primary_href", label: "ลิงก์ปุ่มหลัก", type: "url", th: "/membership", en: "/membership" },
          { key: "global.cta.secondary_label", label: "ปุ่มรอง", th: "ติดต่อสอบถาม", en: "Talk to us" },
          { key: "global.cta.secondary_href", label: "ลิงก์ปุ่มรอง", type: "url", th: "/contact", en: "/contact" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────── home
  {
    page: "home",
    label: "หน้าแรก",
    path: "/",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "home.seo.title", label: "Title", th: `${ORG_TH} (RISA)`, en: `${ORG_EN} (RISA)` },
          { key: "home.seo.description", label: "Description", th: "สมาคมส่งเสริมการวิจัยและมาตรฐานทางอุตสาหกรรม ศูนย์กลางการเชื่อมโยงงานวิจัย มาตรฐาน และภาคอุตสาหกรรมของไทย", en: "RISA is the meeting point for applied research, standards and industry in Thailand." },
        ],
      },
      {
        section: "hero",
        label: "แบนเนอร์หลัก",
        blocks: [
          { key: "home.hero.eyebrow", label: "ข้อความนำ", th: "สมาคมส่งเสริมการวิจัยและมาตรฐานทางอุตสาหกรรม", en: "Research and Industry Standards Advancement Association" },
          { key: "home.hero.title", label: "หัวข้อหลัก", th: "ยกระดับอุตสาหกรรมไทย\nด้วยงานวิจัยและมาตรฐาน", en: "Raising Thai industry\nthrough research and standards" },
          { key: "home.hero.subtitle", label: "คำอธิบาย", th: "RISA คือพื้นที่กลางที่เชื่อมนักวิจัย ผู้ประกอบการ หน่วยงานกำกับดูแล และสถาบันการศึกษา เข้าด้วยกัน เพื่อสร้างมาตรฐานที่ใช้ได้จริงและงานวิจัยที่ต่อยอดสู่การผลิต", en: "RISA is the common ground where researchers, manufacturers, regulators and universities build standards that work — and research that reaches the production floor." },
          { key: "home.hero.primary_label", label: "ปุ่มหลัก", th: "รู้จักสมาคม", en: "About the association" },
          { key: "home.hero.primary_href", label: "ลิงก์ปุ่มหลัก", type: "url", th: "/about", en: "/about" },
          { key: "home.hero.secondary_label", label: "ปุ่มรอง", th: "กิจกรรมล่าสุด", en: "Latest activities" },
          { key: "home.hero.secondary_href", label: "ลิงก์ปุ่มรอง", type: "url", th: "/activities", en: "/activities" },
          { key: "home.hero.image", label: "ภาพประกอบ", type: "image", th: "", en: "" },
        ],
      },
      {
        section: "features",
        label: "รูปภาพการ์ดหน้าแรก",
        blocks: [
          { key: "home.features.research_image", label: "ภาพการ์ดงานวิจัย", type: "image", th: "", en: "" },
          { key: "home.features.about_image", label: "ภาพการ์ดเกี่ยวกับ RISA", type: "image", th: "", en: "" },
        ],
      },
      {
        section: "vision",
        label: "วิสัยทัศน์ / พันธกิจ",
        blocks: [
          { key: "home.vision.eyebrow", label: "ข้อความนำ", th: "วิสัยทัศน์และพันธกิจ", en: "Vision & mission" },
          { key: "home.vision.title", label: "วิสัยทัศน์", th: "มาตรฐานที่เชื่อถือได้ คืออุตสาหกรรมที่แข่งขันได้", en: "Trusted standards make a competitive industry" },
          { key: "home.vision.body", label: "คำอธิบายวิสัยทัศน์", type: "richtext", th: "เราเชื่อว่างานวิจัยจะสร้างผลกระทบได้จริงก็ต่อเมื่อถูกแปลงเป็นมาตรฐานที่ภาคอุตสาหกรรมนำไปใช้ได้ สมาคมจึงทำหน้าที่เป็นตัวกลางระหว่างห้องปฏิบัติการกับสายการผลิต", en: "Research creates impact only when it becomes a standard someone can actually apply. RISA exists to close the distance between the laboratory and the production line." },
          { key: "home.vision.mission_title", label: "หัวข้อพันธกิจ", th: "พันธกิจของเรา", en: "Our mission" },
        ],
      },
      {
        section: "stats",
        label: "ตัวเลขสำคัญ",
        blocks: [
          { key: "home.stats.title", label: "หัวข้อ", th: "สมาคมโดยสังเขป", en: "RISA at a glance" },
          { key: "home.stats.body", label: "คำอธิบาย", th: "ตัวเลขสะสมจากการดำเนินงานร่วมกับเครือข่ายทั่วประเทศ", en: "Cumulative figures from work with our nationwide network." },
        ],
      },
      {
        section: "services",
        label: "สิ่งที่เรามอบให้",
        blocks: [
          { key: "home.services.eyebrow", label: "ข้อความนำ", th: "บริการและกิจกรรม", en: "What we offer" },
          { key: "home.services.title", label: "หัวข้อ", th: "สิ่งที่สมาชิกได้รับจาก RISA", en: "What membership gives you" },
          { key: "home.services.body", label: "คำอธิบาย", th: "ตั้งแต่การเข้าถึงองค์ความรู้ด้านมาตรฐาน ไปจนถึงเวทีนำเสนอผลงานและโอกาสทางอาชีพ", en: "From standards know-how to a stage for your work and a route to your next role." },
        ],
      },
      {
        section: "news",
        label: "ข่าวสารล่าสุด",
        blocks: [
          { key: "home.news.eyebrow", label: "ข้อความนำ", th: "ข่าวสาร", en: "Newsroom" },
          { key: "home.news.title", label: "หัวข้อ", th: "ข่าวสารล่าสุด", en: "Latest news" },
          { key: "home.news.link_label", label: "ลิงก์ดูทั้งหมด", th: "ดูข่าวทั้งหมด", en: "All news" },
        ],
      },
      {
        section: "activities",
        label: "กิจกรรมที่กำลังจะมาถึง",
        blocks: [
          { key: "home.activities.eyebrow", label: "ข้อความนำ", th: "ปฏิทินกิจกรรม", en: "Calendar" },
          { key: "home.activities.title", label: "หัวข้อ", th: "กิจกรรมที่กำลังจะมาถึง", en: "Upcoming activities" },
          { key: "home.activities.link_label", label: "ลิงก์ดูทั้งหมด", th: "ดูกิจกรรมทั้งหมด", en: "All activities" },
        ],
      },
      {
        section: "partners",
        label: "เครือข่ายพันธมิตร",
        blocks: [
          { key: "home.partners.title", label: "หัวข้อ", th: "เครือข่ายและพันธมิตร", en: "Network & partners" },
          { key: "home.partners.body", label: "คำอธิบาย", th: "องค์กรที่ร่วมขับเคลื่อนมาตรฐานอุตสาหกรรมไปกับเรา", en: "Organisations advancing industrial standards alongside us." },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────── about
  {
    page: "about",
    label: "เกี่ยวกับสมาคม",
    path: "/about",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "about.seo.title", label: "Title", th: "ประวัติสมาคม", en: "About the association" },
          { key: "about.seo.description", label: "Description", th: "ความเป็นมา วิสัยทัศน์ พันธกิจ และวัตถุประสงค์ของสมาคมส่งเสริมการวิจัยและมาตรฐานทางอุตสาหกรรม", en: "History, vision, mission and objectives of RISA." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "about.hero.eyebrow", label: "ข้อความนำ", th: "เกี่ยวกับสมาคม", en: "About us" },
          { key: "about.hero.title", label: "หัวข้อ", th: "ประวัติความเป็นมา", en: "Our history" },
          { key: "about.hero.subtitle", label: "คำอธิบาย", th: "จากกลุ่มนักวิจัยเล็ก ๆ สู่สมาคมวิชาชีพที่เชื่อมงานวิจัยเข้ากับมาตรฐานอุตสาหกรรมของประเทศ", en: "From a small circle of researchers to a professional body linking research with national industrial standards." },
        ],
      },
      {
        section: "vision",
        label: "วิสัยทัศน์",
        blocks: [
          { key: "about.vision.title", label: "หัวข้อ", th: "วิสัยทัศน์", en: "Vision" },
          { key: "about.vision.body", label: "เนื้อหา", type: "richtext", th: "เป็นองค์กรกลางที่ได้รับการยอมรับในการส่งเสริมงานวิจัยประยุกต์และมาตรฐานอุตสาหกรรมของประเทศไทย", en: "To be the recognised common body advancing applied research and industrial standards in Thailand." },
          { key: "about.objectives.title", label: "หัวข้อวัตถุประสงค์", th: "วัตถุประสงค์ของสมาคม", en: "Objectives" },
        ],
      },
      {
        section: "timeline",
        label: "เส้นเวลา",
        blocks: [
          { key: "about.timeline.title", label: "หัวข้อ", th: "เส้นทางของสมาคม", en: "Milestones" },
          { key: "about.timeline.body", label: "คำอธิบาย", th: "เหตุการณ์สำคัญตั้งแต่ก่อตั้งจนถึงปัจจุบัน", en: "Key moments from founding to today." },
        ],
      },
      {
        section: "stats",
        label: "ตัวเลขสำคัญ",
        blocks: [
          { key: "about.stats.title", label: "หัวข้อ", th: "ผลการดำเนินงาน", en: "By the numbers" },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────── committee
  {
    page: "committee",
    label: "คณะกรรมการ",
    path: "/committee",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "committee.seo.title", label: "Title", th: "คณะกรรมการสมาคม", en: "Committee" },
          { key: "committee.seo.description", label: "Description", th: "รายนามคณะกรรมการบริหารและที่ปรึกษาของสมาคม", en: "The association's executive committee and advisors." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "committee.hero.eyebrow", label: "ข้อความนำ", th: "โครงสร้างองค์กร", en: "Governance" },
          { key: "committee.hero.title", label: "หัวข้อ", th: "คณะกรรมการสมาคม", en: "The committee" },
          { key: "committee.hero.subtitle", label: "คำอธิบาย", th: "คณะกรรมการบริหารวาระปัจจุบัน พร้อมด้วยคณะที่ปรึกษาผู้ทรงคุณวุฒิ", en: "The current executive committee, together with our panel of advisors." },
        ],
      },
      {
        section: "groups",
        label: "หัวข้อกลุ่ม",
        blocks: [
          { key: "committee.group.president", label: "กลุ่ม: นายกสมาคม", th: "นายกสมาคม", en: "President" },
          { key: "committee.group.committee", label: "กลุ่ม: กรรมการ", th: "คณะกรรมการบริหาร", en: "Executive committee" },
          { key: "committee.group.advisor", label: "กลุ่ม: ที่ปรึกษา", th: "คณะที่ปรึกษา", en: "Advisors" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────── news
  {
    page: "news",
    label: "ข่าวสาร",
    path: "/news",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "news.seo.title", label: "Title", th: "ข่าวสาร", en: "News" },
          { key: "news.seo.description", label: "Description", th: "ข่าวสารและประกาศจากสมาคม", en: "News and announcements from RISA." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "news.hero.eyebrow", label: "ข้อความนำ", th: "ข่าวสาร", en: "Newsroom" },
          { key: "news.hero.title", label: "หัวข้อ", th: "ข่าวสารและประกาศ", en: "News & announcements" },
          { key: "news.hero.subtitle", label: "คำอธิบาย", th: "ความเคลื่อนไหวของสมาคม ผลการดำเนินงาน และประกาศสำคัญถึงสมาชิก", en: "What the association is doing, what it has achieved, and what members need to know." },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── activities
  {
    page: "activities",
    label: "กิจกรรม",
    path: "/activities",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "activities.seo.title", label: "Title", th: "กิจกรรม", en: "Activities" },
          { key: "activities.seo.description", label: "Description", th: "อบรม สัมมนา และกิจกรรมของสมาคม", en: "Training, seminars and events run by RISA." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "activities.hero.eyebrow", label: "ข้อความนำ", th: "ปฏิทินกิจกรรม", en: "Calendar" },
          { key: "activities.hero.title", label: "หัวข้อ", th: "อบรม สัมมนา และกิจกรรม", en: "Training, seminars & events" },
          { key: "activities.hero.subtitle", label: "คำอธิบาย", th: "กิจกรรมที่เปิดให้สมาชิกและบุคคลทั่วไปเข้าร่วมตลอดทั้งปี", en: "Open to members and the public throughout the year." },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── membership
  {
    page: "membership",
    label: "สมัครสมาชิก",
    path: "/membership",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "membership.seo.title", label: "Title", th: "สมัครสมาชิก", en: "Membership" },
          { key: "membership.seo.description", label: "Description", th: "สิทธิประโยชน์และขั้นตอนการสมัครสมาชิกสมาคม", en: "Member benefits and how to join RISA." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "membership.hero.eyebrow", label: "ข้อความนำ", th: "สมาชิกภาพ", en: "Membership" },
          { key: "membership.hero.title", label: "หัวข้อ", th: "ร่วมเป็นสมาชิกสมาคม", en: "Become a member" },
          { key: "membership.hero.subtitle", label: "คำอธิบาย", th: "เข้าถึงองค์ความรู้ด้านมาตรฐาน เครือข่ายวิชาชีพ และสิทธิพิเศษในกิจกรรมของสมาคม", en: "Standards know-how, a professional network, and member rates on everything we run." },
        ],
      },
      {
        section: "benefits",
        label: "สิทธิประโยชน์",
        blocks: [
          { key: "membership.benefits.title", label: "หัวข้อ", th: "สิทธิประโยชน์สมาชิก", en: "Member benefits" },
          { key: "membership.benefits.body", label: "คำอธิบาย", th: "สิ่งที่คุณจะได้รับทันทีเมื่อการสมัครได้รับการอนุมัติ", en: "What you get the moment your application is approved." },
        ],
      },
      {
        section: "types",
        label: "ประเภทสมาชิก",
        blocks: [
          { key: "membership.types.title", label: "หัวข้อ", th: "ประเภทสมาชิก", en: "Membership types" },
          { key: "membership.types.body", label: "คำอธิบาย", th: "เลือกประเภทที่ตรงกับคุณหรือองค์กรของคุณ", en: "Choose the tier that matches you or your organisation." },
        ],
      },
      {
        section: "steps",
        label: "ขั้นตอนการสมัคร",
        blocks: [
          { key: "membership.steps.title", label: "หัวข้อ", th: "ขั้นตอนการสมัคร", en: "How to apply" },
        ],
      },
      {
        section: "form",
        label: "แบบฟอร์มสมัคร",
        blocks: [
          { key: "membership.form.title", label: "หัวข้อ", th: "แบบฟอร์มใบสมัคร", en: "Application form" },
          { key: "membership.form.body", label: "คำอธิบาย", th: "กรอกข้อมูลด้านล่าง เจ้าหน้าที่จะติดต่อกลับภายใน 5 วันทำการ", en: "Fill this in and our office will reply within five working days." },
          { key: "membership.form.note", label: "หมายเหตุใต้ฟอร์ม", type: "richtext", th: "ข้อมูลของท่านจะถูกใช้เพื่อการพิจารณาสมาชิกภาพเท่านั้น", en: "Your details are used only to process your membership application." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────── careers
  {
    page: "careers",
    label: "ตำแหน่งงาน",
    path: "/careers",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "careers.seo.title", label: "Title", th: "ตำแหน่งงาน", en: "Careers" },
          { key: "careers.seo.description", label: "Description", th: "ตำแหน่งงานจากเครือข่ายสมาชิกและพันธมิตรของสมาคม", en: "Roles from RISA's member and partner network." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "careers.hero.eyebrow", label: "ข้อความนำ", th: "ศูนย์อาชีพ", en: "Career centre" },
          { key: "careers.hero.title", label: "หัวข้อ", th: "ตำแหน่งงานในเครือข่าย", en: "Roles in the network" },
          { key: "careers.hero.subtitle", label: "คำอธิบาย", th: "ประกาศรับสมัครงานจากหน่วยงานสมาชิกและพันธมิตรของสมาคม", en: "Openings posted by our member organisations and partners." },
          { key: "careers.hero.post_label", label: "ปุ่มลงประกาศ", th: "ลงประกาศรับสมัครงาน", en: "Post a role" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── research
  {
    page: "research",
    label: "งานวิจัย",
    path: "/research",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "research.seo.title", label: "Title", th: "งานวิจัยและวารสาร", en: "Research & publications" },
          { key: "research.seo.description", label: "Description", th: "คลังผลงานวิจัยและบทความวิชาการของสมาคม", en: "RISA's repository of research and academic publications." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "research.hero.eyebrow", label: "ข้อความนำ", th: "คลังความรู้", en: "Repository" },
          { key: "research.hero.title", label: "หัวข้อ", th: "งานวิจัยและบทความวิชาการ", en: "Research & publications" },
          { key: "research.hero.subtitle", label: "คำอธิบาย", th: "ผลงานที่สมาชิกและเครือข่ายเผยแพร่ผ่านสมาคม รวบรวมไว้ในที่เดียว", en: "Work published by our members and network, gathered in one place." },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────── awards
  {
    page: "awards",
    label: "รางวัล",
    path: "/awards",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "awards.seo.title", label: "Title", th: "รางวัลและเกียรติคุณ", en: "Awards" },
          { key: "awards.seo.description", label: "Description", th: "รางวัลที่สมาคมมอบให้แก่ผลงานและบุคคลดีเด่น", en: "Awards presented by RISA for outstanding work." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "awards.hero.eyebrow", label: "ข้อความนำ", th: "เกียรติคุณ", en: "Recognition" },
          { key: "awards.hero.title", label: "หัวข้อ", th: "รางวัลและเกียรติคุณ", en: "Awards & recognition" },
          { key: "awards.hero.subtitle", label: "คำอธิบาย", th: "ยกย่องผลงานวิจัยและการพัฒนามาตรฐานที่สร้างผลกระทบต่ออุตสาหกรรมไทย", en: "Honouring research and standards work that moved Thai industry forward." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────── gallery
  {
    page: "gallery",
    label: "ประมวลภาพ",
    path: "/gallery",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "gallery.seo.title", label: "Title", th: "ประมวลภาพกิจกรรม", en: "Gallery" },
          { key: "gallery.seo.description", label: "Description", th: "ภาพบรรยากาศกิจกรรมของสมาคม", en: "Photographs from RISA events." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "gallery.hero.eyebrow", label: "ข้อความนำ", th: "ประมวลภาพ", en: "Gallery" },
          { key: "gallery.hero.title", label: "หัวข้อ", th: "ภาพบรรยากาศกิจกรรม", en: "From our events" },
          { key: "gallery.hero.subtitle", label: "คำอธิบาย", th: "บันทึกภาพการประชุม อบรม และงานประจำปีของสมาคม", en: "Meetings, training days and annual gatherings." },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────── downloads
  {
    page: "downloads",
    label: "เอกสารดาวน์โหลด",
    path: "/downloads",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "downloads.seo.title", label: "Title", th: "เอกสารดาวน์โหลด", en: "Downloads" },
          { key: "downloads.seo.description", label: "Description", th: "แบบฟอร์ม ระเบียบ และเอกสารเผยแพร่ของสมาคม", en: "Forms, regulations and published documents." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "downloads.hero.eyebrow", label: "ข้อความนำ", th: "เอกสาร", en: "Documents" },
          { key: "downloads.hero.title", label: "หัวข้อ", th: "เอกสารดาวน์โหลด", en: "Downloads" },
          { key: "downloads.hero.subtitle", label: "คำอธิบาย", th: "แบบฟอร์มสมัครสมาชิก ระเบียบข้อบังคับ และเอกสารเผยแพร่", en: "Application forms, association rules, and published material." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────── map
  {
    page: "map",
    label: "แผนที่เครือข่าย",
    path: "/map",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "map.seo.title", label: "Title", th: "แผนที่เครือข่าย", en: "Network map" },
          { key: "map.seo.description", label: "Description", th: "ที่ตั้งสำนักงาน หน่วยงานสมาชิก และพันธมิตรทั่วประเทศ", en: "Our office, member organisations and partners across Thailand." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "map.hero.eyebrow", label: "ข้อความนำ", th: "เครือข่ายทั่วประเทศ", en: "Nationwide" },
          { key: "map.hero.title", label: "หัวข้อ", th: "แผนที่เครือข่าย RISA", en: "The RISA network map" },
          { key: "map.hero.subtitle", label: "คำอธิบาย", th: "สำนักงานสมาคม หน่วยงานสมาชิก และพันธมิตรที่ร่วมงานกับเรา", en: "Our office, member organisations and the partners we work with." },
          { key: "map.legend.title", label: "หัวข้อคำอธิบายสัญลักษณ์", th: "ประเภทสถานที่", en: "Location types" },
          { key: "map.kind.office", label: "ประเภท: สำนักงาน", th: "สำนักงานสมาคม", en: "Association office" },
          { key: "map.kind.branch", label: "ประเภท: สาขา", th: "สาขา / ศูนย์ภูมิภาค", en: "Regional centre" },
          { key: "map.kind.partner", label: "ประเภท: พันธมิตร", th: "พันธมิตร", en: "Partner" },
          { key: "map.kind.member", label: "ประเภท: สมาชิก", th: "หน่วยงานสมาชิก", en: "Member organisation" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────── contact
  {
    page: "contact",
    label: "ติดต่อเรา",
    path: "/contact",
    sections: [
      {
        section: "seo",
        label: "SEO",
        blocks: [
          { key: "contact.seo.title", label: "Title", th: "ติดต่อเรา", en: "Contact" },
          { key: "contact.seo.description", label: "Description", th: "ที่อยู่ เบอร์โทร อีเมล และแบบฟอร์มติดต่อสมาคม", en: "Address, phone, email and contact form." },
        ],
      },
      {
        section: "hero",
        label: "หัวหน้าเพจ",
        blocks: [
          { key: "contact.hero.eyebrow", label: "ข้อความนำ", th: "ติดต่อ", en: "Get in touch" },
          { key: "contact.hero.title", label: "หัวข้อ", th: "ติดต่อสมาคม", en: "Contact the association" },
          { key: "contact.hero.subtitle", label: "คำอธิบาย", th: "สอบถามเรื่องสมาชิกภาพ ความร่วมมือ หรือกิจกรรม ทีมงานยินดีตอบทุกคำถาม", en: "Membership, partnerships or events — the office is happy to help." },
        ],
      },
      {
        section: "channels",
        label: "ช่องทางติดต่อ",
        blocks: [
          { key: "contact.channels.title", label: "หัวข้อ", th: "ช่องทางติดต่อ", en: "How to reach us" },
          { key: "contact.hours.label", label: "หัวข้อเวลาทำการ", th: "เวลาทำการ", en: "Office hours" },
          { key: "contact.hours.value", label: "เวลาทำการ", th: "จันทร์ – ศุกร์ 09.00 – 17.00 น. (เว้นวันหยุดนักขัตฤกษ์)", en: "Monday – Friday, 09:00 – 17:00 (excluding public holidays)" },
        ],
      },
      {
        section: "form",
        label: "แบบฟอร์มติดต่อ",
        blocks: [
          { key: "contact.form.title", label: "หัวข้อ", th: "ส่งข้อความถึงเรา", en: "Send us a message" },
          { key: "contact.form.body", label: "คำอธิบาย", th: "กรอกแบบฟอร์มด้านล่าง เราจะตอบกลับทางอีเมลโดยเร็วที่สุด", en: "Fill in the form below and we will reply by email as soon as we can." },
        ],
      },
      {
        section: "map",
        label: "แผนที่",
        blocks: [
          { key: "contact.map.title", label: "หัวข้อ", th: "ที่ตั้งสำนักงาน", en: "Find the office" },
          { key: "contact.map.directions_label", label: "ปุ่มนำทาง", th: "เปิดใน Google Maps", en: "Open in Google Maps" },
        ],
      },
    ],
  },
];

/** Flat list of every block definition, with page/section attached. */
export const ALL_BLOCKS = REGISTRY.flatMap((page, pi) =>
  page.sections.flatMap((section, si) =>
    section.blocks.map((block, bi) => ({
      ...block,
      type: block.type ?? ("text" as BlockType),
      page: page.page,
      section: section.section,
      sort: pi * 10000 + si * 100 + bi,
    })),
  ),
);

export const ALL_KEYS = new Set(ALL_BLOCKS.map((b) => b.key));

/** Repeatable lists rendered by <ListSection>. Editable + addable in /admin. */
export const LIST_DEFS = [
  { key: "home.mission", label: "พันธกิจ (หน้าแรก)", page: "home", fields: ["title", "body", "icon"] },
  { key: "about.objectives", label: "วัตถุประสงค์สมาคม", page: "about", fields: ["title", "body", "icon"] },
  { key: "membership.benefits", label: "สิทธิประโยชน์สมาชิก", page: "membership", fields: ["title", "body", "icon"] },
  { key: "membership.types", label: "ประเภทสมาชิก", page: "membership", fields: ["title", "body", "icon"] },
  { key: "membership.steps", label: "ขั้นตอนการสมัคร", page: "membership", fields: ["title", "body", "icon"] },
  { key: "contact.channels", label: "ช่องทางติดต่อ", page: "contact", fields: ["title", "body", "icon", "href"] },
] as const;

export type ListKey = (typeof LIST_DEFS)[number]["key"];
