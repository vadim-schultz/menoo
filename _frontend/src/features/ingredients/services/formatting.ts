export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return String(dateString);
  }
}

export function formatStorageLocation(location: string | null | undefined): string {
  if (!location) return '-';
  return location.charAt(0).toUpperCase() + location.slice(1);
}


