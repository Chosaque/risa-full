"use client";

import { useEffect, useRef, useState } from "react";
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

export type MapPoint = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  kind: "office" | "branch" | "partner" | "member";
  url?: string;
};

/**
 * Marker fill per location kind. The legend swatches on /[locale]/map use the
 * same four tokens — this module is `"use client"`, so a server component
 * cannot import the map from here and the pairing is kept by hand.
 */
const KIND_COLOR: Record<MapPoint["kind"], string> = {
  office: "var(--color-accent)",
  branch: "var(--color-ink)",
  partner: "var(--color-muted)",
  member: "var(--color-faint)",
};

/**
 * A raster basemap built straight from OpenStreetMap tiles: no API key, no tile
 * subscription, and the attribution the OSM tile usage policy requires. `maxzoom`
 * is the deepest zoom OSM serves — past it MapLibre overzooms the last tile.
 */
const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Location URLs come from the database, so only http(s) is ever linked. */
function safeHref(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function markerElement(point: MapPoint): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("aria-label", point.name);
  el.style.cssText = [
    "width:18px",
    "height:18px",
    "border-radius:9999px",
    `background:${KIND_COLOR[point.kind]}`,
    "border:2px solid #ffffff",
    "box-shadow:0 1px 5px rgba(10,10,11,0.35)",
    "cursor:pointer",
  ].join(";");
  return el;
}

function popupLink(href: string, label: string): HTMLAnchorElement {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label;
  a.style.cssText =
    "font-size:12.5px;font-weight:500;color:var(--color-accent);text-decoration:underline;text-underline-offset:3px";
  return a;
}

/** Built as DOM rather than HTML so database text is never parsed as markup. */
function popupContent(point: MapPoint): HTMLElement {
  const root = document.createElement("div");
  root.style.cssText = "font-family:inherit;line-height:1.6";

  const name = document.createElement("p");
  name.textContent = point.name;
  name.style.cssText = "margin:0;font-size:14px;font-weight:600;color:var(--color-ink)";
  root.append(name);

  if (point.address) {
    const address = document.createElement("p");
    address.textContent = point.address;
    address.style.cssText = "margin:4px 0 0;font-size:12.5px;color:var(--color-muted)";
    root.append(address);
  }

  const links = document.createElement("div");
  links.style.cssText = "margin-top:8px;display:flex;flex-direction:column;gap:3px";
  links.append(popupLink(directionsUrl(point.lat, point.lng), "เปิดใน Google Maps"));

  const own = point.url ? safeHref(point.url) : null;
  if (own) links.append(popupLink(own, own.replace(/^https?:\/\//, "").replace(/\/$/, "")));

  root.append(links);
  return root;
}

/**
 * The network map. Renders nothing but an empty framed box when WebGL or the
 * tile host is unavailable — every location is also listed as plain text by the
 * pages that use this component, so a blank map never loses information.
 */
export function MapView({
  points,
  center,
  zoom,
  className,
}: {
  points: MapPoint[];
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  // Captured once: later prop changes move the camera, they never rebuild the map.
  const initialView = useRef({ center, zoom });
  const [ready, setReady] = useState(false);
  const [wheelZoom, setWheelZoom] = useState(false);

  // ── the map itself, created once per mount ───────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container,
        style: OSM_STYLE,
        center: [initialView.current.center.lng, initialView.current.center.lat],
        zoom: initialView.current.zoom,
        maxZoom: 19,
        // Off until the reader clicks, so a swipe over the map still scrolls the page.
        scrollZoom: false,
        attributionControl: { compact: true },
      });
    } catch {
      // No WebGL context, or it is blocked. Leave the frame empty.
      return;
    }

    // Blocked or failed tile requests arrive here; swallowing them keeps a
    // missing basemap from surfacing as an unhandled error.
    map.on("error", () => {});
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.on("click", () => {
      map.scrollZoom.enable();
      setWheelZoom(true);
    });

    mapRef.current = map;
    // Synchronising React state to the just-created imperative map instance —
    // there is no render-time equivalent for "an external library finished mounting".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);

    return () => {
      mapRef.current = null;
      setReady(false);
      setWheelZoom(false);
      map.remove();
    };
  }, []);

  // ── markers and camera, refreshed whenever the points change ─────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current = points.map((point) =>
      new Marker({ element: markerElement(point) })
        .setLngLat([point.lng, point.lat])
        .setPopup(
          new Popup({ offset: 14, closeButton: true, maxWidth: "16rem" }).setDOMContent(
            popupContent(point),
          ),
        )
        .addTo(map),
    );

    if (points.length > 1) {
      const bounds = new LngLatBounds();
      for (const point of points) bounds.extend([point.lng, point.lat]);
      map.fitBounds(bounds, { padding: 64, maxZoom: 14, animate: false });
    } else {
      map.jumpTo({ center: [center.lng, center.lat], zoom });
    }

    return () => {
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
    };
  }, [points, center.lat, center.lng, zoom, ready]);

  return (
    <div
      className={cn(
        "relative h-[28rem] overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
    >
      {/*
        Inline style, not a Tailwind class: maplibre-gl adds its own
        `.maplibregl-map` class to this exact element, and that stylesheet's
        `position: relative` rule has the same specificity as our `.absolute`
        utility — whichever loads later in the cascade wins, which collapses
        this container to zero height when maplibre-gl.css wins the tie.
        An inline style always outranks an external class rule, so it can't
        be silently overridden by import order.
      */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      {ready && !wheelZoom && (
        <p
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-white"
        >
          คลิกที่แผนที่เพื่อเปิดการซูม
        </p>
      )}
    </div>
  );
}
