import { NavLink } from "react-router-dom";
import { CreditCard, QrCode, LogOut, X, ChartArea, NotepadText } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const AdminSidebar = ({ open, setOpen }) => {
    const { signOut } = useClerk();

    const baseLink =
        "flex items-center gap-3 px-4 py-3 rounded-lg transition";

    const active =
        "bg-indigo-600 text-white";

    return (
        <>
            {/* Overlay (mobile only) */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-100 md:z-50 h-screen w-64 bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 md:mt-24  border-b">
                    <h2 className="text-xl font-bold">Admin Panel</h2>

                    {/* Close button (mobile) */}
                    <button
                        onClick={() => setOpen(false)}
                        className="md:hidden"
                    >
                        <X />
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-3 space-y-1">
                    <NavLink
                        to="/admin/payments"
                        className={({ isActive }) =>
                            `${baseLink} ${isActive ? active : "text-gray-700 hover:bg-indigo-100"
                            }`
                        }
                        onClick={() => setOpen(false)}
                    >
                        <CreditCard size={20} />
                        Payment Approvals
                    </NavLink>

                    <NavLink
                        to="/admin/analysis"
                        className={({ isActive }) =>
                            `${baseLink} ${isActive ? active : "text-gray-700 hover:bg-indigo-100"
                            }`
                        }
                        onClick={() => setOpen(false)}
                    >
                        <ChartArea size={20} />
                        Analysis
                    </NavLink>

                    <NavLink
                        to="/admin/applications"
                        className={({ isActive }) =>
                            `${baseLink} ${isActive ? active : "text-gray-700 hover:bg-indigo-100"
                            }`
                        }
                        onClick={() => setOpen(false)}
                    >
                        <NotepadText size={20} />
                        Applications
                    </NavLink>

                    <NavLink
                        to="/admin/attendance"
                        className={({ isActive }) =>
                            `${baseLink} ${isActive ? active : "text-gray-700 hover:bg-indigo-100"
                            }`
                        }
                        onClick={() => setOpen(false)}
                    >
                        <QrCode size={20} />
                        QR Attendance
                    </NavLink>


                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
