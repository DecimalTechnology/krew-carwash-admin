import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Users from "./pages/admin/Users";
import Dashoard from "./pages/admin/Dashoard";
import Building from "./pages/admin/Building";
import Cars from "./pages/admin/Cars";
import Packages from "./pages/admin/Packages";
import AddBuildingPage from "./pages/admin/AddBuilding";
import Login from "./pages/admin/Login";
import Profile from "./pages/admin/Profile";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Cleaners from "./pages/admin/Cleaners";
import Bookings from "./pages/admin/Bookings";
import BookingDetails from "./pages/admin/bookingDetails";
import CleanerDetails from "./pages/admin/CleanerDetails";
import IssueReports from "./pages/admin/IssueReports";

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Toaster 
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#5DB7AE',
                        color: '#fff',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        boxShadow: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
                        fontSize: '15px',
                        fontWeight: '500',
                        maxWidth: '500px',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#5DB7AE',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#5DB7AE',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#F04438',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#F04438',
                        },
                    },
                }}
            />
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashoard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="building" element={<Building />} />
                    <Route path="cars" element={<Cars />} />
                    <Route path="packages" element={<Packages />} />
                    <Route path="add-building" element={<AddBuildingPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="cleaners" element={<Cleaners />} />
                    <Route path="cleaners/:id" element={<CleanerDetails />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="bookings/:id" element={<BookingDetails />} />
                    <Route path="issue-reports" element={<IssueReports />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
