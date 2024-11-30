// Use a fixed base URL instead of environment variable
const BASE_URL = 'http://127.0.0.1:8000/api';

// Function to get annotations
export const getAnnotations = async (feedbackId) => {
  try {
    const response = await fetch(`${BASE_URL}/annotations/?feedback=${feedbackId}`);
    if (!response.ok) {
      throw new Error('Error fetching annotations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return [];
  }
};

// Function to create a new annotation
export const createAnnotation = async (annotation) => {
  try {
    const response = await fetch(`${BASE_URL}/annotations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annotation),
    });
    if (!response.ok) {
      throw new Error('Error creating annotation');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating annotation:', error);
    return null;
  }
};

// Function to delete an annotation
export const deleteAnnotation = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/annotations/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting annotation');
    }
    return await response.json(); // Return any data if available
  } catch (error) {
    console.error('Error deleting annotation:', error);
    return null;
  }
};

// Function to upload feedback
export const uploadFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${BASE_URL}/feedback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
      throw new Error('Error uploading feedback');
    }
    return await response.json();
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
