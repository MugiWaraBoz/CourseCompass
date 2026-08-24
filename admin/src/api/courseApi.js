import clientApi from './clientApi';

// page, selectedDept, selectedSort, selectedOrder, search
export async function getCourses(search) {
  try {
    const response = await clientApi.get('/courses', {
      params: {
        search: search,
        limit: 20,
      },
    });
    // console.log(response.data);

    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to load courses. Please try again.', {
      cause: error,
    });
  }
}

export async function getCourseInfo(id) {
  try {
    const response = await clientApi.get(`/courses/${id}`, {});
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to load course. Please try again.', {
      cause: error,
    });
  }
}

export async function addCourse(courseData) {
  try {
    const response = await clientApi.post('/courses', courseData);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to add course. Please try again.', {
      cause: error,
    });
  }
}

export async function updateCourse(id, updatedData) {
  try {
    const response = await clientApi.patch(`/courses/${id}`, updatedData);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to update course. Please try again.', {
      cause: error,
    });
  }
}

export async function deleteCourse(id) {
  try {
    const response = await clientApi.delete(`/courses/${id}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to delete course. Please try again.', {
      cause: error,
    });
  }
}
