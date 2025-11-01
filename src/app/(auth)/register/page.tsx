import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import RegisterPageIntro from "@/components/registerPage/RegisterPageIntro";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return (
    <main>
      <RegisterPageIntro />
      <FinalCTA />
      <Footerii />
    </main>
  );
}
