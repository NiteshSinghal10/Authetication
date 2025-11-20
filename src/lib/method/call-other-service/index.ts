import axios from 'axios';

export const callOtherService = async <T>(
  url: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE',
  data?: object,
  options?: object,
): Promise<T> => {
  try {
    const config = {
      method,
      url,
      data,
      ...options,
    };

    const response = await axios(config);

    return response.data as T;
  } catch (error: any) {
    if (error.response) {
      // server responded with a status outside 2xx
      throw error.response.data;
    } else if (error.request) {
      // request was made but no response
      throw {
        message: 'No response received from server',
        details: error.request,
      };
    } else {
      // something else went wrong
      throw { message: error.message };
    }
  }
};
