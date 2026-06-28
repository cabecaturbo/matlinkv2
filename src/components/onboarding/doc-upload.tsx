"use client";

import { useRef, useState } from "react";
import { Upload, X, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadVerificationDoc } from "@/lib/upload";
import { addVerificationDoc, removeVerificationDoc } from "@/app/onboarding/actions";

type Doc = { id: string; doc_type: string | null };

export function DocUpload({
  userId,
  initialDocs,
}: {
  userId: string;
  initialDocs: Doc[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(undefined);
    try {
      const path = await uploadVerificationDoc(file, userId);
      const res = await addVerificationDoc(path, file.type);
      if (res.error || !res.id) throw new Error(res.error);
      setDocs((d) => [...d, { id: res.id!, doc_type: file.type }]);
    } catch {
      setError("Upload failed — only images or PDF, up to 10 MB.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(id: string) {
    setDocs((d) => d.filter((x) => x.id !== id));
    await removeVerificationDoc(id);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {docs.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2 text-muted">
              <FileCheck2 size={15} className="text-success" />
              Verification document
            </span>
            <button
              type="button"
              onClick={() => remove(d.id)}
              aria-label="Remove document"
              className="text-muted hover:text-danger"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
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
        {busy ? "Uploading…" : "Upload document"}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
