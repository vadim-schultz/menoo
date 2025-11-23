export function formatLocationName(location: string): string {
  if (!location || location === 'null' || location === 'unspecified') {
    return 'Unspecified Location';
  }
  return location.charAt(0).toUpperCase() + location.slice(1);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return String(dateString);
  }
}


