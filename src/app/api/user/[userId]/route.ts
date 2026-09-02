import { users } from "@/features/users/user.data";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { userId } = await context.params;
  const id = Number(userId);
  const user = users.find((currentUser) => currentUser.id === id);

  if (!user) {
    return Response.json({ error: "User Not Found" }, { status: 401 });
  }

  return Response.json(user, { status: 200 });
}
