import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex">
            <AdminSidebar open={open} setOpen={setOpen} />

            {/* Main content */}
            <div className="flex-1 md:ml-64 min-h-screen bg-gray-50">
                {/* Top bar (mobile) */}
                <div className="md:hidden mt-24 p-4 border-b bg-white flex items-center">
                    <button onClick={() => setOpen(true)}>
                        <Menu />
                    </button>
                    <h1 className="ml-4 font-semibold">Admin Panel</h1>
                </div>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
