export async function uploadDocumentFile(
  file: File,
  opts?: { tenantId?: string; cargoId?: string },
): Promise<{ url: string; name: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (opts?.tenantId) formData.append('tenantId', opts.tenantId);
  if (opts?.cargoId) formData.append('cargoId', opts.cargoId);

  const response = await fetch('/api/upload/document', { method: 'POST', body: formData });

  if (!response.ok) {
    let message = `Upload failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const result = await response.json() as { ok: boolean; url?: string; name?: string; error?: string };
  if (!result.ok || !result.url) {
    throw new Error(result.error ?? 'The server did not return a file URL.');
  }

  return { url: result.url, name: result.name ?? file.name };
}
