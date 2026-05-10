"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CampaignOption = { id: string; title: string };

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã phát hành" },
  { value: "revoked", label: "Đã thu hồi" },
];

export function CertificateFilters({
  campaigns,
}: {
  campaigns: CampaignOption[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete("page");
    startTransition(() => {
      router.push(`/admin/certificates?${next.toString()}`);
    });
  };

  return (
    <form
      className="grid gap-3 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        updateParam("q", String(fd.get("q") ?? ""));
      }}
      aria-busy={pending}
    >
      <div className="space-y-1.5 sm:col-span-1">
        <Label htmlFor="cert-q" className="text-xs">
          Tìm theo MSSV / tên / mã xác minh
        </Label>
        <Input
          id="cert-q"
          name="q"
          defaultValue={params.get("q") ?? ""}
          placeholder="VD: PS43995 hoặc Nguyễn..."
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Chiến dịch</Label>
        <Select
          value={params.get("campaign") ?? "all"}
          onValueChange={(v) => updateParam("campaign", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {campaigns.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Trạng thái</Label>
        <Select
          value={params.get("status") ?? "all"}
          onValueChange={(v) => updateParam("status", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
