"use client";

import { useState } from "react";
import Model3DViewer from "@/components/Model3DViewer";
import { Button } from "@/components/Button";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: ArrayBuffer;
}

export default function QuotePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const data = await file.arrayBuffer();

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data,
      });
    }

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("message", formData.message);

      files.forEach((file, index) => {
        const blob = new Blob([file.data]);
        submitData.append(`file_${index}`, blob, file.name);
      });

      const response = await fetch("/api/quotes", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setFiles([]);
      } else {
        alert("Failed to submit quote request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

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
                Supported: STL, OBJ, 3MF, STEP. Upload at least one file to submit.
              </p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-[var(--color-fg)]/80">
                  Uploaded Files
                </p>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3 rounded-lg"
                    >
                      <span className="text-sm text-[var(--color-fg)]/80 truncate">
                        {file.name}{" "}
                        <span className="text-[var(--color-fg)]/50">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="shrink-0 border-[var(--analog-amber)] text-[var(--analog-amber)] hover:bg-[var(--analog-amber)] hover:text-[var(--tech-slate)]"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
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
          {files.length > 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--color-fg)]/80 mb-3">
                3D Preview
              </h3>

              <Model3DViewer
                modelData={files[0].data}
                fileType={getFileExtension(files[0].name)}
              />

              <p className="text-xs text-[var(--color-fg)]/60 mt-3 text-center">
                Showing: <span className="text-[var(--color-fg)]/80">{files[0].name}</span>
              </p>
            </div>
          ) : (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center h-96 flex items-center justify-center">
              <div>
                <p className="text-[var(--color-fg)]/70 mb-2">
                  Upload a 3D file to see a preview
                </p>
                <p className="text-sm text-[var(--color-fg)]/50">
                  Supported: STL, OBJ, 3MF, STEP
                </p>
              </div>
            </div>
          )}

          {/* Optional helper CTA */}
          <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl p-5">
            <p className="text-sm text-[var(--color-fg)]/70">
              Not sure what to upload? Send what you have (STL/STEP preferred) and add
              notes about material, quantity, and deadline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}