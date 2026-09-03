import { getContentMap, blockValue } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { isEditMode } from "@/lib/auth";
import { sanitizeHtml, cn } from "@/lib/utils";
import { EditableClient, type EditableTag } from "./EditableClient";

type Props = {
  /** Key from src/content/registry.ts. */
  k: string;
  as?: EditableTag;
  className?: string;
  /** Render `\n` in the stored value as line breaks. */
  multiline?: boolean;
};

/**
 * Renders one registry-backed string. In edit mode it becomes click-to-edit;
 * otherwise it is a plain element with no client JS.
 */
export async function Editable({ k, as = "span", className, multiline }: Props) {
  const [map, editing, locale] = await Promise.all([getContentMap(), isEditMode(), getLocale()]);
  const block = map.get(k);
  const value = blockValue(block, locale);
  const Tag = as;

  const body =
    block?.type === "richtext" ? (
      <span
        className="prose-risa contents"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
      />
    ) : (
      value
    );

  if (!editing) {
    if (!value) return null;
    return (
      <Tag className={cn(multiline && "whitespace-pre-line", className)}>{body}</Tag>
    );
  }

  return (
    <EditableClient
      contentKey={k}
      label={block?.label ?? k}
      type={block?.type ?? "text"}
      valueTh={block?.value_th ?? ""}
      valueEn={block?.value_en ?? ""}
      locale={locale}
      as={Tag}
      className={cn(multiline && "whitespace-pre-line", className)}
      isEmpty={!value}
    >
      {body}
    </EditableClient>
  );
}

/** Rich-text block rendered as a block-level container. */
export async function EditableRich({ k, className }: { k: string; className?: string }) {
  const [map, editing, locale] = await Promise.all([getContentMap(), isEditMode(), getLocale()]);
  const block = map.get(k);
  const value = blockValue(block, locale);

  const html = <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />;

  if (!editing) {
    if (!value) return null;
    return <div className={cn("prose-risa", className)}>{html}</div>;
  }

  return (
    <EditableClient
      contentKey={k}
      label={block?.label ?? k}
      type="richtext"
      valueTh={block?.value_th ?? ""}
      valueEn={block?.value_en ?? ""}
      locale={locale}
      as="div"
      className={cn("prose-risa", className)}
      isEmpty={!value}
    >
      {html}
    </EditableClient>
  );
}
