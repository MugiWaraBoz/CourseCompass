import clientApi from './clientApi';

// Student status API
const fetchStudentStatus = async () => {
  try {
    const response = await clientApi.get('/status/student');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(
      message || 'Unable to load student status. Please try again.',
      {
        cause: error,
      }
    );
  }
};

// Course status API
const fetchCourseStatus = async () => {
  try {
    const response = await clientApi.get('/status/course');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(
      message || 'Unable to load course status. Please try again.',
      {
        cause: error,
      }
    );
  }
};

// Faculty status API
const fetchFacultyStatus = async () => {
  try {
    const response = await clientApi.get('/status/faculty');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(
      message || 'Unable to load faculty status. Please try again.',
      {
        cause: error,
      }
    );
  }
};

// Review status API
const fetchReviewStatus = async () => {
  try {
    const response = await clientApi.get('/status/review');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(
      message || 'Unable to load review status. Please try again.',
      {
        cause: error,
      }
    );
  }
};

export {
  fetchStudentStatus,
  fetchCourseStatus,
  fetchFacultyStatus,
  fetchReviewStatus,
};
