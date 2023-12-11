import { redirect } from "next/navigation";

export default function Home() {
  redirect("/site?domain=lemmy.ml");
}
