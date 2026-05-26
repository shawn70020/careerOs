import { auth } from "@/auth";
import { apiError } from "@/lib/api-error";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { user: null, error: apiError("UNAUTHORIZED", "Please sign in", 401) };
  }
  return { user: session.user, error: null };
}
