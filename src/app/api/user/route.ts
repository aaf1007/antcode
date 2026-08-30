import { users } from "@/features/users/user.data";

export function GET(): Response {
  return Response.json(users, { status: 200 });
}
