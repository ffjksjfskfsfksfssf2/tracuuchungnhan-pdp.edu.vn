"use client";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_TEMPLATE_CONFIG,
  type TemplateConfig,
} from "@/lib/generator/template-config";

export function PositionConfigForm({
  config,
  onChange,
}: {
  config: TemplateConfig;
  onChange: (next: TemplateConfig) => void;
}) {
  const reset = () => onChange(structuredClone(DEFAULT_TEMPLATE_CONFIG));

  const updateBox = (
    key: "fullName" | "studentCode" | "verificationCode",
    field: string,
    value: number | string,
  ) => {
    const current = config[key];
    if (!current) return;
    onChange({
      ...config,
      [key]: { ...current, [field]: value },
    });
  };

  const updateQr = (field: "x" | "y" | "size", value: number) => {
    const current = config.qrCode;
    if (!current) return;
    onChange({ ...config, qrCode: { ...current, [field]: value } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Toạ độ tính bằng pixel theo kích thước gốc của template. (0, 0) ở góc
          trên-trái.
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcwIcon aria-hidden />
          Khôi phục mặc định
        </Button>
      </div>

      <BoxSection
        title="Họ và tên"
        box={config.fullName}
        onChange={(field, value) => updateBox("fullName", field, value)}
        showFontControls
      />
      <BoxSection
        title="Mã số sinh viên"
        box={config.studentCode}
        onChange={(field, value) => updateBox("studentCode", field, value)}
        showFontControls
      />
      {config.verificationCode ? (
        <BoxSection
          title="Mã xác minh"
          box={config.verificationCode}
          onChange={(field, value) =>
            updateBox("verificationCode", field, value)
          }
          showFontControls
        />
      ) : null}
      {config.qrCode ? (
        <fieldset className="space-y-3 border-t pt-4">
          <legend className="text-sm font-semibold">Mã QR</legend>
          <div className="grid grid-cols-3 gap-3">
            <NumberField
              label="x"
              value={config.qrCode.x}
              onChange={(v) => updateQr("x", v)}
            />
            <NumberField
              label="y"
              value={config.qrCode.y}
              onChange={(v) => updateQr("y", v)}
            />
            <NumberField
              label="Kích thước"
              value={config.qrCode.size}
              onChange={(v) => updateQr("size", v)}
            />
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}

function BoxSection({
  title,
  box,
  onChange,
  showFontControls,
}: {
  title: string;
  box: NonNullable<TemplateConfig["fullName"]>;
  onChange: (field: string, value: number | string) => void;
  showFontControls?: boolean;
}) {
  return (
    <fieldset className="space-y-3 border-t pt-4">
      <legend className="text-sm font-semibold">{title}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField
          label="x"
          value={box.x}
          onChange={(v) => onChange("x", v)}
        />
        <NumberField
          label="y"
          value={box.y}
          onChange={(v) => onChange("y", v)}
        />
        <NumberField
          label="Rộng"
          value={box.width}
          onChange={(v) => onChange("width", v)}
        />
        <NumberField
          label="Cao"
          value={box.height}
          onChange={(v) => onChange("height", v)}
        />
      </div>
      {showFontControls ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberField
            label="Cỡ chữ tối đa"
            value={box.fontSize ?? 0}
            onChange={(v) => onChange("fontSize", v)}
          />
          <NumberField
            label="Cỡ chữ tối thiểu"
            value={box.minFontSize ?? 0}
            onChange={(v) => onChange("minFontSize", v)}
          />
          <div className="space-y-1.5">
            <Label className="text-xs">Màu</Label>
            <Input
              type="color"
              value={box.color ?? "#000000"}
              onChange={(e) => onChange("color", e.target.value)}
              className="h-10 w-full p-1"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Căn lề</Label>
            <select
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              value={box.align ?? "center"}
              onChange={(e) => onChange("align", e.target.value)}
            >
              <option value="left">Trái</option>
              <option value="center">Giữa</option>
              <option value="right">Phải</option>
            </select>
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="h-10"
      />
    </div>
  );
}
