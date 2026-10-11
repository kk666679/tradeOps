export async function uploadDocumentFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload/document', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Document upload failed with status ${response.status}.`);
  }

  const result: unknown = await response.json();
  if (
    typeof result !== 'object' ||
    result === null ||
    !('received' in result) ||
    result.received !== true
  ) {
    throw new Error('The server did not confirm receipt of the document.');
  }

  return file.name;
}
