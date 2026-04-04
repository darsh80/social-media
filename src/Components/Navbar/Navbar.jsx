import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import logo from "../../assets/1145.jpg";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBell,
  FaUsers,
  FaBookmark,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getHeaders } from "../../helper/HeadersObj";

export default function Appnav() {
  const { token, setToken, userData } = useContext(AuthContext);
  const { name, email, photo } = userData || {};
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/notifications/unread-count`,
          getHeaders(),
        );
        // The API returns { data: { unreadCount: 6 } }
        return data.data?.unreadCount || data.count || data.unreadCount || 0;
      } catch (err) {
        return 0;
      }
    },
    enabled: !!token,
    refetchInterval: 30000,
  });

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  const navLinkStyle = ({ isActive }) =>
    `relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition-all duration-300 ${
      isActive
        ? "bg-white text-[#1f6fe5] shadow-sm transform scale-105"
        : "text-slate-500 hover:bg-white/90 hover:text-slate-900"
    }`;

  return (
<nav className="fixed top-0 z-50 w-full bg-slate-50/90 shadow-md backdrop-blur-md">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

    {/* Logo */}
    <NavLink to="/" className="flex items-center gap-3 group">
      <img
        src={logo}
        alt="Logo"
        className="w-12 h-12 rounded-full border border-slate-200 shadow-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"
      />
      <span className="text-2xl font-bold text-slate-800 tracking-tight">
        MUNS
      </span>
    </NavLink>

    {/* Links */}
    <div className="hidden md:flex items-center gap-3 bg-white/30 rounded-full p-1">
      {token ? (
        <>
          <NavLink to="/" className={navLinkStyle + " text-slate-700 hover:bg-slate-200/40"}>
            <FaHome size={20} />
            <span className="hidden lg:block">Feed</span>
          </NavLink>
          <NavLink to="/Profail" className={navLinkStyle + " text-slate-700 hover:bg-slate-200/40"}>
            <FaUser size={20} />
            <span className="hidden lg:block">Profile</span>
          </NavLink>
          <NavLink to="/requests" className={navLinkStyle + " text-slate-700 hover:bg-slate-200/40"}>
            <FaUsers size={20} />
            <span className="hidden lg:block">Requests</span>
          </NavLink>
          <NavLink to="/bookmarks" className={navLinkStyle + " text-slate-700 hover:bg-slate-200/40"}>
            <FaBookmark size={20} />
            <span className="hidden lg:block">Bookmarks</span>
          </NavLink>
          <NavLink to="/notifications" className={navLinkStyle + " relative text-slate-700 hover:bg-slate-200/40"}>
            <FaBell size={20} />
            <span className="hidden lg:block">Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-400 text-[10px] font-bold text-white shadow-sm ring-1 ring-slate-50">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login" className={navLinkStyle + " text-slate-700 hover:bg-slate-200/40"}>
            <FaSignInAlt size={20} />
            <span className="hidden lg:block">Login</span>
          </NavLink>
          <NavLink to="/register" className={navLinkStyle + " text-slate-700 hover:bg-slate-200/40"}>
            <FaUserPlus size={20} />
            <span className="hidden lg:block">Register</span>
          </NavLink>
        </>
      )}
    </div>

    {/* User Dropdown */}
    <div className="flex items-center justify-end min-w-[50px]">
      {token && (
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 shadow-sm cursor-pointer transition-all duration-300 hover:bg-white/90">
              <img
                src={photo || "https://via.placeholder.com/150"}
                alt="User"
                className="h-9 w-9 rounded-full border border-slate-300 object-cover"
              />
              <span className="hidden sm:block font-semibold text-slate-800 text-sm">
                {name}
              </span>
            </div>
          }
        >
          <DropdownHeader className="px-4 py-3 bg-slate-100 rounded-t-xl text-slate-800">
            <span className="block text-sm font-bold">{name}</span>
            <span className="block truncate text-sm font-medium">{email}</span>
          </DropdownHeader>
          <DropdownItem
            onClick={() => navigate("/Profail")}
            className="font-semibold text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            👤 View Profile
          </DropdownItem>
          <DropdownDivider className="border-slate-300/50" />
          <DropdownItem
            onClick={handleLogout}
            className="text-rose-500 font-semibold hover:bg-rose-100/50 transition-colors"
          >
            Sign out
          </DropdownItem>
        </Dropdown>
      )}
    </div>
  </div>
</nav>
  );
}
