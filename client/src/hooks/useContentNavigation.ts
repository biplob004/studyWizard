import { useState, useEffect, useCallback } from 'react';
import { Content } from '@/types';
import { fetchContent } from '@/services/api';

export const useContentNavigation = (initialCoursePath:string, initialContentId: string) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async (course_path:string, contentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContent(course_path, contentId);
      setContent(data);
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent(initialCoursePath, initialContentId);
  }, [initialCoursePath, initialContentId, loadContent]);

  const navigateNext = useCallback(() => {
    if (content?.nextId) {
      loadContent(initialCoursePath, content.nextId);
    }
  }, [content, loadContent, initialCoursePath]);

  const navigatePrevious = useCallback(() => {
    if (content?.previousId) {
      loadContent(initialCoursePath, content.previousId);
    }
  }, [content, loadContent, initialCoursePath]);

  return {
    content,
    loading,
    error,
    navigateNext,
    navigatePrevious,
    hasNext: !!content?.nextId,
    hasPrevious: !!content?.previousId,
  };
};
