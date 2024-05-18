import axios from "axios";

class Interceptors {

    // Start listening with interceptors:
    public listen(): void {

        // Create interceptor for request:
        axios.interceptors.request.use(request => {

            // Add token to Authorization header: 
            request.headers.Authorization = "Bearer " + sessionStorage.getItem("token"); // Don't forget space after the word "Bearer " !!

            // Return new request: 
            return request;
        });
    }

}

export const interceptors = new Interceptors();
