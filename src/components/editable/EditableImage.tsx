import { getContentMap, blockValue } from "@/lib/content";
import { getLocale } from "@/lib/request";
import { isEditMode } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { EditableImageClient } from "./EditableImageClient";
import { Placeholder } from "@/components/site/Placeholder";

type Props = {
  k: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** Seed for the generated placeholder shown when no image is set. */
  seed?: string;
};

/** A registry-backed image slot. Click to pick or upload in edit mode. */
export async function EditableImage({ k, alt = "", className, imgClassName, seed }: Props) {
  const [map, editing, locale] = await Promise.all([getContentMap(), isEditMode(), getLocale()]);
  const block = map.get(k);
  const url = blockValue(block, locale);

  const inner = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={cn("size-full object-cover", imgClassName)} loading="lazy" />
  ) : (
    <Placeholder seed={seed ?? k} className={cn("size-full", imgClassName)} />
  );

  if (!editing) return <div className={cn("overflow-hidden", className)}>{inner}</div>;

  return (
    <EditableImageClient
      contentKey={k}
      label={block?.label ?? k}
      value={url}
      className={cn("overflow-hidden", className)}
    >
      {inner}
    </EditableImageClient>
  );
}
