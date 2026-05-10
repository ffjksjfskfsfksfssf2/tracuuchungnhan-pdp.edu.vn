"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  lookupFormSchema,
  type LookupFormInput,
} from "@/lib/validation/student-code";

export function LookupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupFormInput>({
    resolver: zodResolver(lookupFormSchema),
    defaultValues: { studentCode: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setSubmitting(true);
    startTransition(() => {
      const code = values.studentCode.trim().toUpperCase();
      router.push(`/lookup?code=${encodeURIComponent(code)}`);
    });
  });

  const isBusy = submitting || isPending;

  return (
    <form
      onSubmit={(event) => {
        if (!isBusy) {
          void onSubmit(event);
        } else {
          event.preventDefault();
          toast.info("Vui lòng đợi một chút...");
        }
      }}
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-end"
      noValidate
    >
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="studentCode" className="text-sm">
          Mã số sinh viên (MSSV)
        </Label>
        <Input
          id="studentCode"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="VD: PS43995"
          aria-invalid={errors.studentCode ? "true" : "false"}
          aria-describedby={errors.studentCode ? "studentCode-error" : undefined}
          className="h-11 text-base uppercase"
          {...register("studentCode")}
        />
        {errors.studentCode ? (
          <p
            id="studentCode-error"
            className="text-destructive text-sm"
            role="alert"
          >
            {errors.studentCode.message}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={isBusy}
        className="bg-pdp-orange hover:bg-pdp-orange/90 h-11 px-5 text-white"
      >
        {isBusy ? (
          <Loader2Icon className="animate-spin" aria-hidden />
        ) : (
          <SearchIcon aria-hidden />
        )}
        Tra cứu
      </Button>
    </form>
  );
}
