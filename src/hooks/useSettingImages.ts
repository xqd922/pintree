import { useState, useEffect } from 'react';

type Image = {
  id: string;
  url: string;
}

export const useSettingImages = (settingKey: string) => {
  const [imagesData, setImagesData] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettingImages = async () => {
      try {
        // 在 JSON 模式下，从设置 API 获取图片 URL
        const response = await fetch('/api/settings');
        const settings = await response.json();
        
        let imageUrl = '';
        switch (settingKey) {
          case 'logoUrl':
            imageUrl = settings.logoUrl || '/logo.png';
            break;
          case 'faviconUrl':
            imageUrl = settings.faviconUrl || '/favicon.ico';
            break;
          default:
            imageUrl = '';
        }

        if (imageUrl) {
          setImagesData([{ id: settingKey, url: imageUrl }]);
        } else {
          setImagesData([]);
        }
        setError(null);
      } catch (err) {
        setImagesData([]);
        setError(err instanceof Error ? err.message : 'Get setting images failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettingImages();
  }, [settingKey]);

  return { 
    images: imagesData, 
    isLoading,
    error
  };
};