export interface NavItem {
  label: string;
  href: string;
}

/* A section stays current on its sub-pages (/work/web-app/ -> Work).
   trailingSlash is on, so paths arrive as "/work/". */
export function isCurrent(pathname: string, href: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}
