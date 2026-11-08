import { requireChatGPTUser } from "../chatgpt-auth";
import AdminReview from "./review";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireChatGPTUser("/admin");
  return <AdminReview />;
}
