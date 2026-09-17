import { useContext } from 'react';
import { ContentContext } from '@/content/ContentContext';

/** The site's content, as loaded from the CMS. */
export function useContent() {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error('useContent must be used inside a ContentProvider');
  }
  return content;
}
