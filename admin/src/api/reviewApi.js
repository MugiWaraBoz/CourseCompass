import clientApi from './clientApi';

// Grab all student reviews
export const getAllStudentReviews = async (studentId) => {
  try {
    const response = await clientApi.get(`students/admin/${studentId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch student reviews. Please try again.', {
      cause: error,
    });
  }
};

// Grab all course reviews
export const getAllCourseReviews = async (courseId) => {
  try {
    const response = await clientApi.get(`courses/admin/${courseId}/reviews`);
    // console.log("Course reviews response API:", response.data); // Log the response data
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch course reviews. Please try again.', {
      cause: error,
    });
  }
};

// Grab all faculty reviews
export const getAllFacultyReviews = async (facultyId) => {
  try {
    const response = await clientApi.get(`faculty/admin/${facultyId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch faculty reviews. Please try again.', {
      cause: error,
    });
  }
};

// delete a review by reviewId
export const deleteReview = async (reviewId) => {
  try {
    const response = await clientApi.delete(`/reviews/admin/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error('Unable to delete review. Please try again.', {
      cause: error,
    });
  }
};

// patch a review by reviewId
export const patchReview = async (reviewId, updatedData) => {
  try {
    const response = await clientApi.patch(
      `/reviews/admin/${reviewId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    throw new Error('Unable to update review. Please try again.', {
      cause: error,
    });
  }
};

export const getAllPendingStudentReviews = async () => {
  try {
    const response = await clientApi.get('reviews/admin/pending');
    return response.data;
  } catch (error) {
    throw new Error(
      'Unable to fetch pending student reviews. Please try again.',
      {
        cause: error,
      }
    );
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await clientApi.patch(`reviews/admin/${reviewId}/approve`);
    return response.data;
  } catch (error) {
    throw new Error('Unable to approve review. Please try again.', {
      cause: error,
    });
  }
};
