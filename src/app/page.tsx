import { MenuExperience } from "@/components/menu/MenuExperience";
import { getMenu } from "@/lib/menu";

export default async function Home() {
  const doc = await getMenu();
  return <MenuExperience doc={doc} />;
}
