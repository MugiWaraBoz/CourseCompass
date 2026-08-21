import clientApi from './clientApi';

// page, selectedDept, selectedSort, selectedOrder, search
export async function getFacultys(search) {
  try {
    const response = await clientApi.get('/faculty', {
      params: {
        search: search,
        limit: 20,
      },
    });
    // console.log(response.data);

    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to load faculty. Please try again.', {
      cause: error,
    });
  }
}

export async function getFacultyInfo(id) {
  try {
    const response = await clientApi.get(`/faculty/${id}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to load faculty. Please try again.', {
      cause: error,
    });
  }
}

export async function addFaculty(facultyData) {
  try {
    const response = await clientApi.post('/faculty', facultyData);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to add faculty. Please try again.', {
      cause: error,
    });
  }
}

export async function updateFaculty(id, updatedData) {
  try {
    const response = await clientApi.patch(`/faculty/${id}`, updatedData);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to update faculty. Please try again.', {
      cause: error,
    });
  }
}

export async function deleteFaculty(id) {
  try {
    const response = await clientApi.delete(`/faculty/${id}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to delete faculty. Please try again.', {
      cause: error,
    });
  }
}
