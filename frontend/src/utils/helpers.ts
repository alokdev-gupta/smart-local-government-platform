/**
 * Formats a date string or Date object into a readable string.
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true 
  });
};

/**
 * Returns a human-readable "time ago" string (e.g., "2 hours ago").
 */
export const timeAgo = (date: string | Date): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'just now';
};

/**
 * Formats bytes into a human-readable file size.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Truncates a string to a specified length and adds ellipsis.
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Generates initials from a full name.
 */
export const getInitials = (fullName: string): string => {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .filter(Boolean)
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Checks if a given date is in the past (expired).
 */
export const isExpired = (date: string | Date): boolean => {
  return new Date(date).getTime() < new Date().getTime();
};

/**
 * Generates a CSV string from an array of objects.
 */
export const generateCSV = (data: Record<string, unknown>[], headers: string[]): string => {
  if (!data || !data.length) return '';
  
  const headerRow = headers.join(',') + '\n';
  const bodyRows = data.map(row => {
    return headers.map(header => {
      const val = row[header];
      const strVal = typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val || '');
      // Escape quotes and wrap in quotes if there's a comma
      const escaped = strVal.replace(/"/g, '""');
      return strVal.includes(',') || strVal.includes('"') ? `"${escaped}"` : escaped;
    }).join(',');
  }).join('\n');
  
  return headerRow + bodyRows;
};
