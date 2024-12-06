import apiClient from './apiClient';

// Function to get annotations
export const getAnnotations = async (feedbackId) => {
  try {
    const response = await apiClient.get(`/api/annotations/?feedback=${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return [];
  }
};

// Function to create a new annotation
export const createAnnotation = async (annotation) => {
  try {
    const response = await apiClient.post('/api/annotations/', annotation);
    return response.data;
  } catch (error) {
    console.error('Error creating annotation:', error);
    return null;
  }
};

// Function to delete an annotation
export const deleteAnnotation = async (id) => {
  try {
    const response = await apiClient.delete(`/api/annotations/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting annotation:', error);
    return null;
  }
};

// Function to upload feedback
export const uploadFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post('/api/feedback/', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error uploading feedback:', error);
    return null;
  }
};

// Export all as a single object
export default {
  getAnnotations,
  createAnnotation,
  deleteAnnotation,
  uploadFeedback,
};
