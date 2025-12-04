// import { memo, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   ChevronRight,
//   ChevronLeft,
//   LayoutDashboard,
//   Folder,
//   User,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const Sidebar = memo(({ onLinkClick, isCollapsed, toggleSidebar }) => {
//   const location = useLocation();
//   const [openMenu, setOpenMenu] = useState(null);

//   const slugify = (text) =>
//     text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

//   // ✅ Sidebar Items with all routes from App.jsx
//   const sidebarItems = [
//     {
//       label: "Dashboard",
//       icon: <LayoutDashboard size={18} />,
//       path: "/HomePage/Dashboard.aspx",
//     },
//     {
//       label: "Master",
//       icon: <Folder size={18} />,
//       subItems: [
//         { label: "Tank Type Master", path: "/HomePage/Master/TankTypeList.aspx" },
//         { label: "Ownership Type Master", path: "/HomePage/Master/FrmOwnerTypeList.aspx" },
//         { label: "Contractor Master", path: "/HomePage/Master/FrmContractorList.aspx" },
//         { label: "Staff Master", path: "/HomePage/Master/FrmStaffList.aspx" },
//         { label: "Rate Config Master", path: "/HomePage/Master/FrmRateConfigList.aspx" },
//       ],
//     },
//     {
//       label: "Configuration",
//       icon: <Folder size={18} />,
//       subItems: [
//         { label: "Tank Type Config", path: "/HomePage/Configuration/FrmTankTypeConfig.aspx" },
//         { label: "Ownership Configuration", path: "/HomePage/Configuration/FrmOwnershipConfig.aspx" },
//         { label: "Contractor Configuration", path: "/HomePage/Configuration/FrmContractorConfig.aspx" },
//         { label: "Staff Configuration", path: "/HomePage/Configuration/FrmStaffConfig.aspx" },
//       ],
//     },
//     {
//       label: "Transaction",
//       icon: <Folder size={18} />,
//       subItems: [
//         { label: "Assign Inspection" },
//         { label: "Inspection Entry" },
//         { label: "Job Assignment" },
//         { label: "Cleaning Execution" },
//         { label: "Bill Generation" },
//         { label: "Receipt Collection" },
//       ],
//     },
//   ];

//   const toggleMenu = (menu) => {
//     if (isCollapsed) {
//       toggleSidebar();
//       setTimeout(() => setOpenMenu(menu), 200);
//     } else {
//       setOpenMenu(openMenu === menu ? null : menu);
//     }
//   };

//   return (
//     <div
//       className={`flex flex-col h-full border-r shadow-sm transition-[width] duration-200 ease-in-out overflow-hidden`}
//       style={{
//         width: isCollapsed ? "4rem" : "16rem",
//         willChange: "width",
//       }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-2 border-b">
//         <div className="flex items-center justify-center gap-3 overflow-hidden">
//           <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center shrink">
//             <User size={18} />
//           </div>
//           {!isCollapsed && (
//             <div>
//               <div className="text-sm font-semibold text-black leading-tight">
//                 Septic Tank Management
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Collapse Button */}
//         <button
//           onClick={toggleSidebar}
//           className="text-gray-600 hover:text-gray-800 transition-colors shrink"
//         >
//           {isCollapsed ? (
//             <ChevronRight className="h-5 w-5" />
//           ) : (
//             <ChevronLeft className="h-5 w-5" />
//           )}
//         </button>
//       </div>

//       {/* Sidebar Links */}
//       <nav className="flex-1 overflow-y-auto p-2 space-y-1">
//         {sidebarItems.map((item, i) =>
//           !item.subItems ? (
//             <Link
//               key={i}
//               to={item.path}
//               onClick={onLinkClick}
//               className={`text-decoration-none flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-150 border-l-4 ${
//                 location.pathname === item.path
//                   ? "bg-blue-50 text-blue-600 border-blue-600"
//                   : "text-gray-700 hover:bg-gray-100 border-transparent"
//               }`}
//             >
//               {item.icon}
//               {!isCollapsed && <span>{item.label}</span>}
//             </Link>
//           ) : (
//             <div key={i}>
//               <button
//                 onClick={() => toggleMenu(item.label)}
//                 className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-150 ${
//                   isCollapsed ? "justify-center" : ""
//                 }`}
//               >
//                 <span className="flex items-center gap-3">
//                   {item.icon}
//                   {!isCollapsed && item.label}
//                 </span>
//                 {!isCollapsed && (
//                   <ChevronRight
//                     className={`h-4 w-4 transition-transform ${
//                       openMenu === item.label ? "rotate-90 text-blue-600" : ""
//                     }`}
//                   />
//                 )}
//               </button>

//               {/* Submenu */}
//               {!isCollapsed && (
//                 <AnimatePresence initial={false}>
//                   {openMenu === item.label && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="ml-6 mt-1 space-y-1 border-l pl-2 border-gray-200"
//                     >
//                       {item.subItems.map((sub, j) => {
//                         const path =
//                           item.label === "Transaction"
//                             ? `/HomePage/Transaction/${slugify(sub.label)}`
//                             : sub.path;

//                         return (
//                           <Link
//                             key={j}
//                             to={path}
//                             onClick={onLinkClick}
//                             className={`text-decoration-none block text-black px-3 py-1.5 rounded-md text-sm transition-all duration-150 border-l-4 ${
//                               location.pathname.startsWith(path)
//                                 ? "text-blue-600 bg-blue-50 border-blue-600"
//                                 : "text-gray-600 hover:bg-gray-100 border-transparent"
//                             }`}
//                           >
//                             {sub.label}
//                           </Link>
//                         );
//                       })}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               )}
//             </div>
//           )
//         )}
//       </nav>

//       {/* Footer */}
//       {!isCollapsed && (
//         <footer className="p-3 border-t text-center text-xs text-gray-500">
//           Powered By:{" "}
//           <span className="text-blue-600 font-medium">ASCENTech</span>
//         </footer>
//       )}
//     </div>
//   );
// });

// export default Sidebar;




import React, { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Folder,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../../apiService.js";
import config from "../../utils/config.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";

const Sidebar = memo(({ onLinkClick, isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Convert backend PAGEPATH to frontend route
  const convertPagePath = (pagePath, title) => {
    if (title?.toLowerCase() === "dashboard") return "/Dashboard";
    if (!pagePath) return "";
    return `/${pagePath.replace(/^\.\.\//, "").replace("@=", "/")}`;
  };

  // Build menu structure
  const buildMenuHierarchy = (menuData) => {
    const menuMap = {};
    menuData.forEach((m) => {
      const id = Number(m.MENUID);
      const parentId = Number(m.PARENTID);
      menuMap[id] = {
        id,
        label: m.MENUTITLE?.trim(),
        path: convertPagePath(m.PAGEPATH, m.MENUTITLE),
        parentId,
        subItems: [],
      };
    });

    const hierarchy = [];
    Object.values(menuMap).forEach((menu) => {
      if (menu.parentId === 0) hierarchy.push(menu);
      else if (menuMap[menu.parentId]) menuMap[menu.parentId].subItems.push(menu);
    });

    const allowedParents = ["Dashboard", "Master", "Configuration", "Transaction"];
    const filtered = hierarchy.filter((p) => allowedParents.includes(p.label));

    filtered.forEach((p) => {
      p.subItems.sort((a, b) => a.id - b.id);
      p.icon =
        p.label === "Dashboard"
          ? <LayoutDashboard size={18} />
          : <Folder size={18} />;
    });

    return [
      ...filtered.filter((i) => i.subItems.length === 0),
      ...filtered.filter((i) => i.subItems.length > 0)
    ];
  };

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const payload = {
          userId: user?.userId,
          ulbId: user?.ulbId,
          deptId: config.deptId,
        };

        const response = await apiService.post("SepticMenus", payload);
        const data = response?.data?.data || [];
        console.log("data:",data)
        const structured = buildMenuHierarchy(data);
        setSidebarItems(structured);
      } catch (error) {
        console.error("Error fetching sidebar:", error);
        setSidebarItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [user]);

  // Toggle dropdown menus
  const toggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      

      {/* SIDEBAR */}
      <div
        className={`flex flex-col h-full bg-white border-r shadow-sm transition-all duration-300`}
        style={{
          width: isCollapsed ? (isMobile ? "0rem" : "4rem") : "16rem",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center justify-center gap-3 overflow-hidden">
            <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center shrink">
              <User size={18} />
            </div>
            {!isCollapsed && (
              <div>
                <div className="text-sm font-semibold text-black leading-tight">
                  Septic Tank Management
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 transition-colors shrink"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <p className="text-center text-gray-500 text-sm mt-3">
              ⏳ Loading menu...
            </p>
          ) : (
            sidebarItems.map((item, i) => (
              <div key={i}>
                {/* Single link */}
                {item.subItems.length === 0 ? (
                  <Link
                    to={item.path}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 border-l-4 ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-600 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100 border-transparent"
                    }`}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                ) : (
                  <>
                    {/* Folder parent */}
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-150 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {!isCollapsed && item.label}
                      </span>
                      {!isCollapsed && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            openMenu === item.label ? "rotate-90 text-blue-600" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Dropdown */}
                    {!isCollapsed && (
                      <AnimatePresence initial={false}>
                        {openMenu === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-6 mt-1 space-y-1 border-l pl-2 border-gray-200 rounded"
                          >
                            {item.subItems.map((sub, j) => (
                              <Link
                                key={j}
                                to={sub.path}
                                onClick={onLinkClick}
                                className={`block text-decoration-none px-3 py-1.5 rounded-md text-sm border-l-4 transition-all duration-150 ${
                                  location.pathname.startsWith(sub.path)
                                    ? "text-blue-600 bg-blue-50 border-blue-600"
                                    : "text-gray-700 hover:bg-gray-100 border-transparent"
                                }`}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <footer className="p-3 border-t text-center text-xs ">
            <a href="https://nagarkaryavalinewuat.com/" target="_blank" className="text-decoration-none">
            <span className="text-gray-500">Powered By: {""}</span>
            <span className="text-blue-600 font-medium">ASCENTech</span></a>
          </footer>
        )}
      </div>
    </>
  );
});

export default Sidebar;



