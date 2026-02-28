"use client";

import { useEffect, useMemo, useState } from "react";
import Model3DViewer from "@/components/Model3DViewer";
import { Button } from "@/components/Button";

type SelectedFile = {
  id: string;
  file: File;
};

const MAX_FILES = 5;

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

const ALLOWED_EXT = new Set(["stl", "obj", "3mf", "step", "stp"]);

const PREVIEWABLE_EXT = new Set(["stl"]);

function getExt(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
}

function validateFile(file: File): string | null {
  const ext = getExt(file.name);
  if (!ALLOWED_EXT.has(ext)) {
    return `Unsupported file type: .${ext || "unknown"}. Allowed: ${[...ALLOWED_EXT].join(", ")}`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `File too large (${formatBytes(file.size)}). Max ${formatBytes(MAX_FILE_BYTES)}.`;
  }
  return null;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: ArrayBuffer;
}

export default function QuotePage() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);

  const [previewBuf, setPreviewBuf] = useState<ArrayBuffer | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const previewFile = useMemo(() => {
    if (!previewFileId) return null;
    return files.find((f) => f.id === previewFileId) ?? null;
  }, [files, previewFileId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPreviewBuf(null);

      if(!previewFile) return;

      const ext = getExt(previewFile.file.name);
      if(!PREVIEWABLE_EXT.has(ext)) return;

      setPreviewLoading(true);
      try {
        const buf = await previewFile.file.arrayBuffer();
        if (!cancelled) setPreviewBuf(buf);
      }finally{
        if (!cancelled) setPreviewLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    }
  }, [previewFile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const nextErrors: string[] = [];
    const nextFiles: SelectedFile[] = [];

    const remainingSlots = Math.max(0, MAX_FILES - files.length);
    const toTake = Math.min(selected.length, remainingSlots);

    if (selected.length > remainingSlots) {
      nextErrors.push(`You can only upload ${MAX_FILES} files. ${selected.length - remainingSlots} file(s) were not added.`); 
    }

    for (let i = 0; i < toTake; i++) {
      const file = selected[i];

      const err = validateFile(file);
      if (err) {
        nextErrors.push(`${file.name}: ${err}`);
        continue;
      }

      const dupe = files.some((f) => f.file.name === file.name && f.file.size === file.size);
      if (dupe) {
        nextErrors.push(`${file.name}: already added.`);
        continue;
      }

      nextFiles.push({
        id: crypto.randomUUID(),
        file
      });
    }

    setFileErrors(nextErrors);
    if(nextFiles.length) setFiles((prev) => [...prev, ...nextFiles]);

    e.currentTarget.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setFileErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFileErrors([]);

    if (files.length === 0) {
      setFileErrors(["Please upload at least one file."]);
      setSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("message", formData.message);

      files.forEach(({file}) => {
        submitData.append("files", file, file.name);
      });

      const response = await fetch("/api/quotes", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setFiles([]);
        setPreviewBuf(null);
        setPreviewFileId(null);
      } else {
        const data = await response.json().catch(() => null);
        const msg =
          (data && typeof data.error === "string" && data.error) ||
          "Failed to submit quote. Please try again.";
        setFileErrors([msg]);
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      setFileErrors(["An error occurred. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  const previewExt = previewFile ? getExt(previewFile.file.name) : "";

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8">
          <div className="text-[var(--digital-cyan)] text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-3 text-[var(--color-fg)]">
            Quote Request Submitted!
          </h2>
          <p className="text-[var(--color-fg)]/70 mb-6">
            Thank you for your quote request. We'll review your files and get
            back to you within 24–48 hours.
          </p>

          <Button variant="digital" onClick={() => setSubmitted(false)}>
            Submit Another Quote
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ CUSTOM QUOTE ]
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 text-[var(--color-fg)]">
          Request a Custom 3D Print Quote
        </h1>
        <p className="text-[var(--color-fg)]/70 mt-3 max-w-3xl">
          Upload your 3D model files (STL, OBJ, 3MF, STEP) and we’ll provide a
          detailed quote including material options, print time, and pricing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Name <span className="text-[var(--analog-amber)]">*</span>
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Email <span className="text-[var(--analog-amber)]">*</span>
              </label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Phone
              </label>
              <input
                type="tel"
                className="input"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Additional Details
              </label>
              <textarea
                rows={4}
                className="input"
                placeholder="Quantity, material preferences, deadline, etc."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-[var(--color-fg)]/80">
                Upload 3D Files <span className="text-[var(--color-fg)]/50">(required)</span>
              </label>

              <input
                title="Upload File(s)"
                type="file"
                multiple
                accept=".stl,.obj,.3mf,.step,.stp"
                onChange={handleFileUpload}
                className={[
                  "block w-full text-sm",
                  "file:mr-4 file:h-11 file:px-5 file:rounded-md file:border-0",
                  "file:font-bold file:uppercase file:tracking-widest",
                  "file:bg-[var(--color-secondary)] file:text-[var(--color-bg)]",
                  "hover:file:bg-[var(--color-primary)]",
                  "file:cursor-pointer",
                  "text-[var(--color-fg)]/70",
                ].join(" ")}
              />
              <p className="mt-2 text-xs text-[var(--color-fg)]/60">
                Supported: STL, OBJ, 3MF, STEP. Up to {MAX_FILES} files. Max{""}
                {formatBytes(MAX_FILE_BYTES)} each.
              </p>
              {fileErrors.length > 0 && (
              <div className="mt-3 rounded-lg border border-[var(--analog-amber)] bg-[var(--analog-amber)]/10 p-3 text-sm text-[var(--color-fg)] space-y-1">
                {fileErrors.map((e, idx) => (
                  <div key={idx}>• {e}</div>
                ))}
              </div>
            )}
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-[var(--color-fg)]/80">
                  Uploaded Files
                </p>

                <div className="space-y-2">
                  {files.map(({id, file}) => {
                    const ext = getExt(file.name);
                    const canPreview = PREVIEWABLE_EXT.has(ext);
                    const isActive = previewFileId === id;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 rounded-lg"
                    >
                      <div className="min-w-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewFileId(id)}
                        title={canPreview ? "Click to preview" : "Preview not available for this file type"}
                        className={["text-sm text-left text-[var(--color-fg)]/80 truncate block", canPreview ? "hover:text-[var(--digital-cyan)]" : ""].join(" ")}
                      >
                        {file.name}{" "}
                        <span className="text-[var(--color-fg)]/50">
                          ({formatBytes(file.size)})
                        </span>
                      </Button>

                      {!canPreview ? (
                        <div className="text-xs text-var[(--color-fg)]/50 mt-1">
                          Preview currently supports STL Only.
                        </div>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(id)}
                      className="shrink-0 border border-[var(--analog-amber)] text-[var(--analog-amber)] hover:bg-[var(--analog-amber)] hover:text-[var(--tech-slate)]"
                    >
                      Remove
                    </Button>
                  </div>
                  )})}
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="digital"
              className="w-full"
              disabled={submitting || files.length === 0}
              aria-disabled={submitting || files.length === 0}
            >
              {submitting ? "Submitting..." : "Submit Quote Request"}
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          {previewFile ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--color-fg)]/80 mb-3">
                3D Preview
              </h3>

              {PREVIEWABLE_EXT.has(previewExt) ? (
                previewLoading ? (
                  <div className="h-96 flex items-center justify-center text-sm text-[var(--color-fg)]/60">
                    Loading preview…
                  </div>
                ) : previewBuf ? (
                  <Model3DViewer modelData={previewBuf} fileType={previewExt} />
                ) : (
                  <div className="h-96 flex items-center justify-center text-sm text-[var(--color-fg)]/60">
                    Preview unavailable.
                  </div>
                )
              ) : (
                <div className="h-96 flex items-center justify-center text-center text-sm text-[var(--color-fg)]/60 px-6">
                  Preview currently supports STL only. You can still upload{" "}
                  {previewExt.toUpperCase()} for quoting.
                </div>
              )}

              <p className="text-xs text-[var(--color-fg)]/60 mt-3 text-center">
                Showing:{" "}
                <span className="text-[var(--color-fg)]/80">
                  {previewFile.file.name}
                </span>
              </p>
            </div>
          ) : (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center h-96 flex items-center justify-center">
              <div>
                <p className="text-[var(--color-fg)]/70 mb-2">
                  Upload a 3D file to see a preview
                </p>
                <p className="text-sm text-[var(--color-fg)]/50">
                  Preview currently supports STL only.
                </p>
              </div>
            </div>
          )}

          {/* Optional helper CTA */}
          <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl p-5">
            <p className="text-sm text-[var(--color-fg)]/70">
              Not sure what to upload? Send what you have (STL/STEP preferred)
              and add notes about material, quantity, and deadline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}