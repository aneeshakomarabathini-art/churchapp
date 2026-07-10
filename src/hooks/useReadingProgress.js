import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useReadingProgress = () => {
  const saveProgress = useCallback(async (progress) => {
    try {
      await AsyncStorage.setItem('readingProgress', JSON.stringify(progress));
    } catch (e) {
      console.error('Save progress error:', e);
    }
  }, []);

  const loadProgress = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('readingProgress');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Load progress error:', e);
      return null;
    }
  }, []);

  return { saveProgress, loadProgress };
};
