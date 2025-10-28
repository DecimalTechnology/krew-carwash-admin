import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Users from "./pages/admin/Users";
import Dashoard from "./pages/admin/Dashoard";
import Building from "./pages/admin/Building";
import Cars from "./pages/admin/Cars";
import Packages from "./pages/admin/Packages";
import AddBuildingPage from "./pages/admin/AddBuilding";

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashoard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="building" element={<Building />} />
                    <Route path="cars" element={<Cars />} />
                    <Route path="packages" element={<Packages />} />
                    <Route path="add-building" element={<AddBuildingPage />} />


                </Route>
            </Routes>
        </Router>
    );
}
