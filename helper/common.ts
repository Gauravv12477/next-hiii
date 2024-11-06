// <-----------commonAPi's-------------->

import userServices from "@/services/userServices"; // Assuming this handles API calls to the backend
import { isEqual } from "lodash";

export const LogOut = async (): Promise<boolean> => {
    try {
        // Call the backend logout endpoint
        const response = await userServices.logout();

        // Check if the logout was successful
        if (isEqual(response.status, 200)) {
            return true; // Successful logout
        }

        // Logout failed
        return false;
    } catch (error) {
        console.error("Logout failed:", error);
        return false; // Logout unsuccessful
    }
};
