import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Users from "./pages/admin/Users";
import Dashoard from "./pages/admin/Dashoard";
import Building from "./pages/admin/Building";
import Cars from "./pages/admin/Cars";

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

                </Route>
            </Routes>
        </Router>
    );
}
