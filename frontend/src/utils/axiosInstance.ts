import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false; // Track if a refresh is in progress
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason: any) => void;
}[] = [];

const processQueue = (error: any, success = false) => {
  failedQueue.forEach((promise) => {
    if (success) {
      promise.resolve();
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// Intercepting the response to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // If successful, return the response
  async (error) => {
    const originalRequest = error.config;

    // Check if the response is 401 and the request hasn't been retried
    if (
      error.response &&
      error.response.status === 400 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If token is being refreshed, wait for it to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest)) // Retry the original request after refreshing
          .catch((err) => Promise.reject(err)); // If refresh fails, reject the original request
      }

      // Mark the request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await axiosInstance.get("/api/users/refresh");

        // Store the new access token in localStorage (no need to stringify)
        localStorage.setItem("access_token", response.data.accessToken);

        // Process the failed requests in the queue
        processQueue(null, true);

        // Reset the refreshing state
        isRefreshing = false;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (err) {
        // If token refresh fails, reject all queued requests
        processQueue(err, false);
        isRefreshing = false;
        return Promise.reject(err); // Return the error if token refresh fails
      }
    }

    // If it's not a 401 error, just reject the error as usual
    return Promise.reject(error);
  }
);

export default axiosInstance;
