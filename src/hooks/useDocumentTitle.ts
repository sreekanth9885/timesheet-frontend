// src/hooks/useDocumentTitle.ts
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice";

const BASE_TITLE = "TimePro";

/**
 * Keeps the browser tab title in sync with the authenticated user.
 *
 *  - Not logged in          → "TimePro"
 *  - Super admin            → "Super Admin — TimePro"
 *  - Org admin / employee   → "<Organization Name> — TimePro"
 */
export function useDocumentTitle() {
  const user = useSelector(selectUser);

  const title = (() => {
    if (!user) return BASE_TITLE;
    if (user.role === "super_admin") return `Super Admin — ${BASE_TITLE}`;
    return user.organization_name
      ? `${user.organization_name} — ${BASE_TITLE}`
      : BASE_TITLE;
  })();

  useEffect(() => {
    document.title = title;
  }, [title]);
}
