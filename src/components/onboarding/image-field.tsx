"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from "@/lib/upload";

export function ImageField({
  kind,
  value,
  onChange,
  userId,
}: {
  kind: "photo" | "cover";
  value: string;
  onChange: (url: string) => void;
  userId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(undefined);
    try {
      const url = await uploadAvatar(file, userId, kind);
      onChange(url);
    } catch {
      setError("Upload failed — try a smaller image.");
    } finally {
      setBusy(false);
    }
  }

  const square = kind === "photo";

  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "overflow-hidden border border-border bg-surface-2",
          square ? "h-20 w-20 rounded-full" : "h-16 w-28 rounded-md",
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handle}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
        </Button>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    </div>
  );
}
