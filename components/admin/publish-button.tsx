"use client";

import { useTransition } from "react";
import { Loader2Icon, RocketIcon, UndoIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  publishCampaign,
  unpublishCampaign,
} from "@/app/admin/campaigns/[campaignId]/actions";

export function PublishButton({
  campaignId,
  isPublished,
}: {
  campaignId: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    const action = isPublished ? unpublishCampaign : publishCampaign;
    const verb = isPublished ? "huỷ phát hành" : "phát hành";
    if (
      !confirm(
        isPublished
          ? "Huỷ phát hành chiến dịch? Các chứng nhận đang phát hành sẽ trở về trạng thái Nháp và không tra cứu được nữa."
          : "Phát hành chiến dịch? Tất cả chứng nhận trạng thái Nháp sẽ chuyển sang Đã phát hành và sẵn sàng cho sinh viên tra cứu.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const res = await action(campaignId);
      if (res.ok) {
        toast.success(
          `Đã ${verb} chiến dịch (${res.affected.toLocaleString("vi-VN")} chứng nhận).`,
        );
      } else {
        toast.error(res.error);
      }
    });
  };

  if (isPublished) {
    return (
      <Button variant="outline" onClick={onClick} disabled={pending}>
        {pending ? (
          <Loader2Icon className="animate-spin" aria-hidden />
        ) : (
          <UndoIcon aria-hidden />
        )}
        Huỷ phát hành
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={pending}
      className="bg-emerald-600 text-white hover:bg-emerald-700"
    >
      {pending ? (
        <Loader2Icon className="animate-spin" aria-hidden />
      ) : (
        <RocketIcon aria-hidden />
      )}
      Phát hành chiến dịch
    </Button>
  );
}
