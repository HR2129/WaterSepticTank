// import { useState, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
// import Navbar from "../../HOC/Navbar/Navbar.jsx";

// const Layout = () => {
//   const [isCollapsed, setIsCollapsed] = useState(true); // mobile closed by default
//   const [isMobile, setIsMobile] = useState(false);
//   const location = useLocation();

//   const toggleSidebar = () => setIsCollapsed((prev) => !prev);

//   // Detect Mobile
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Listen for hamburger click event from Navbar
//   useEffect(() => {
//     const handler = () => setIsCollapsed((prev) => !prev);
//     window.addEventListener("toggle-sidebar", handler);
//     return () => window.removeEventListener("toggle-sidebar", handler);
//   }, []);

//   return (
//     <div className="min-h-screen flex">

//       {/* SIDEBAR */}
//       <aside
//         className={`fixed top-0 left-0 h-full border-r shadow-sm transition-all duration-300 z-50
//           ${isMobile ? (isCollapsed ? "w-0" : "w-64") : isCollapsed ? "w-16" : "w-64"}`}
//       >
//         <Sidebar
//           location={location}
//           isCollapsed={isCollapsed}
//           toggleSidebar={toggleSidebar}
//         />
//       </aside>

//       {/* MAIN AREA */}
//       <div
//         className="flex-1 flex flex-col transition-all duration-300"
//         style={{
//           marginLeft: isMobile ? "0px" : isCollapsed ? "4rem" : "16rem",
//         }}
//       >
//         {/* NAVBAR */}
//         <header
//           className="fixed top-0 right-0 left-0 z-40 shadow-sm h-24 sm:h-16 flex items-center bg-white"
//           style={{
//             marginLeft: isMobile ? "0px" : isCollapsed ? "4rem" : "16rem",
//           }}
//         >
//           <Navbar />
//         </header>

//         {/* CONTENT */}
//         {/* <main
//           className="flex-1 overflow-y-auto bg-blue-50 p-6"
//           style={{ marginTop: "4rem" }}
//         >
//           <Outlet />
//         </main> */}

//         <main
//           className="flex-1 overflow-y-auto bg-blue-50 px-4 py-10 mt-36 sm:mt-16"
//           style={{
//     overflowX: "hidden", // 🚀 prevents whole-page horizontal scroll
//   }}
//         >
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import Navbar from "../../HOC/Navbar/Navbar.jsx";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handler = () => setIsCollapsed((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  // DESKTOP sidebar width logic
  const desktopSidebarWidth = isCollapsed ? "4rem" : "16rem";

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full border-r shadow-sm transition-all duration-300 z-50
          ${isMobile
            ? isCollapsed
              ? "w-0"    // hidden
              : "w-64"  // overlay width
            : desktopSidebarWidth  // desktop push layout
          }
        `}
        style={{
          position: isMobile ? "fixed" : "fixed", // overlay on mobile, fixed on desktop
          background: "white",
        }}
      >
        <Sidebar location={location} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </aside>

      {/* MAIN AREA */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0px" : desktopSidebarWidth, // ONLY desktop pushes content
        }}
      >
        {/* NAVBAR */}
        <header
          className="fixed top-0 right-0 left-0 z-40 shadow-sm h-24 sm:h-16 flex items-center bg-white transition-all duration-300"
          style={{
            marginLeft: isMobile ? "0px" : desktopSidebarWidth,
          }}
        >
          <Navbar />
        </header>

        {/* CONTENT */}
        <main
          className="flex-1 overflow-y-auto bg-blue-50 px-4 py-10 mt-36 sm:mt-16"
          style={{ overflowX: "hidden" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


