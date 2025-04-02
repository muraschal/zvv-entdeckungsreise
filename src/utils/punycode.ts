/**
 * Punycode-Alternative für die Verarbeitung von Unicode-Domains
 */
export function toASCII(domain: string): string {
  return domain
    .toLowerCase()
    .split('.')
    .map(label => {
      // Prüfe, ob das Label bereits ASCII ist
      if (/^[a-z0-9-]+$/.test(label)) {
        return label;
      }
      
      // Konvertiere Unicode zu Punycode
      return 'xn--' + encodeURIComponent(label)
        .replace(/%/g, '')
        .toLowerCase();
    })
    .join('.');
}

export function toUnicode(domain: string): string {
  return domain
    .toLowerCase()
    .split('.')
    .map(label => {
      if (label.startsWith('xn--')) {
        try {
          return decodeURIComponent(
            label
              .slice(4)
              .split('')
              .map(char => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
              .join('')
          );
        } catch {
          return label;
        }
      }
      return label;
    })
    .join('.');
} 