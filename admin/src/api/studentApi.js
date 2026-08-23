import clientApi from './clientApi';

// page, selectedDept, selectedSort, selectedOrder, search
export async function getAllStudent(search) {
  try {
    const response = await clientApi.get('/students', {
      params: {
        search: search,
        limit: 20,
      },
    });
    // console.log(response.data);

    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to load students. Please try again.', {
      cause: error,
    });
  }
}

// grab a single student by studentId
export async function getStudentInfo(studentId) {
  try {
    const response = await clientApi.get(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to load student. Please try again.', {
      cause: error,
    });
  }
}

// Delete a student by studentId
export async function deleteStudent(studentId) {
  try {
    const response = await clientApi.delete(`/students/${studentId}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to delete student. Please try again.', {
      cause: error,
    });
  }
}

// update verified status
export async function changeVerifyStatus(studentId, verified) {
  try {
    const response = await clientApi.patch(`/students/${studentId}/verify`, {
      verified,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(
      message ||
        'Unable to update student verification status. Please try again.',
      {
        cause: error,
      }
    );
  }
}
