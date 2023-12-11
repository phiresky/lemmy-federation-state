"use client";

import { InstanceList } from "@/components/instance-list";
import { useSearchParams } from "next/navigation";

export default function SiteInfo() {
  const query = useSearchParams();
  return <InstanceList domain={query.get("domain") ?? "lemmy.ml"} />;
}
