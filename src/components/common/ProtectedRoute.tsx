import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../api/admin/authService";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "../../app/store";
import { setAdminData, setAdminLoading } from "../../features/adminSlice";
import { getAdminProfile } from "../../api/admin/profileService";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const dispatch = useDispatch();
    const adminData = useSelector((state: IRootState) => state.admin.adminData);
    const isLoading = useSelector((state: IRootState) => state.admin.isLoading);

    useEffect(() => {
        // Fetch admin profile if authenticated but no admin data in Redux
        const fetchProfile = async () => {
            if (isAuthenticated() && !adminData) {
                dispatch(setAdminLoading(true));
                try {
                    const response = await getAdminProfile();
                    if (response.success && response.data) {
                        dispatch(setAdminData(response.data));
                    }
                } catch (error) {
                    console.error("Failed to fetch admin profile:", error);
                } finally {
                    dispatch(setAdminLoading(false));
                }
            }
        };

        fetchProfile();
    }, [adminData, dispatch]);

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Show a loading state while fetching profile data
    if (isLoading && !adminData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}

