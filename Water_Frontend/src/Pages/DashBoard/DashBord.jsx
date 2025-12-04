// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Droplets,
//   ClipboardList,
//   Truck,
//   CheckCircle,
//   Brush,
//   IndianRupee,
// } from "lucide-react";
// import apiService from "../../../apiService.js";
// import Table from "../../Components/Table/Table";
// import { useAuth } from "../../Context/AuthContext.jsx";
// import CalendarIcon from "../../Components/Calendar/CalendarIcon.jsx";

// const formatToAPIDate = (date) => {
//   if (!date) return "";

//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   const d = date.getDate().toString().padStart(2, "0");
//   const m = months[date.getMonth()];
//   const y = date.getFullYear();

//   return `${d}-${m}-${y}`;
// };

// const Dashboard = () => {
//   const { user } = useAuth();
//   console.log("AUTH USER:", user);

//   const [totalTanks, setTotalTanks] = useState("-");
//   const [pendingInspections, setPendingInspections] = useState("-");
//   const [todaysRequests, setTodaysRequests] = useState("-");
//   const [activeAssignments, setActiveAssignments] = useState("-");
//   const [jobsCompletedToday, setJobsCompletedToday] = useState("-");
//   const [totalRevenue, setTotalRevenue] = useState("₹-");
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [contractors, setContractors] = useState([]);

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentPage, setCurrentPage] = useState(1);

//   const rowsPerPage = 5;

//   // =====================================================
//   // LOAD ALL DASHBOARD DATA
//   // =====================================================
//   useEffect(() => {
//     if (!user || !user.ulbId) {
//       console.log("User not ready → Skipping API calls...");
//       return;
//     }

//     console.log("User Ready → Fetching Dashboard Data...");

//     fetchTotalTanks();
//     fetchPendingInspections();
//     fetchTodaysRequests();
//     fetchActiveAssignments();
//     fetchJobsCompletedToday();
//     fetchTotalRevenue();
//     fetchTopContractors();

//     const apiDate = formatToAPIDate(selectedDate);
//     fetchPendingRequests(apiDate);
//   }, [user, selectedDate]);

//   // =====================================================
//   // API CALLS
//   // =====================================================
//   const fetchTotalTanks = async () => {
//     try {
//       const res = await apiService.post("totalTankRegister", {});
//       setTotalTanks(res.data?.data?.[0]?.COUNT || "-");
//     } catch (error) {
//       console.error("Error fetching total tanks:", error);
//     }
//   };

//   const fetchPendingInspections = async () => {
//     try {
//       const res = await apiService.post("pendingCount", {});
//       setPendingInspections(res.data?.data?.[0]?.COUNTT || "-");
//     } catch (error) {
//       console.error("Error fetching pending inspections:", error);
//     }
//   };

//   const fetchTodaysRequests = async () => {
//     try {
//       const res = await apiService.post("todaysRequest", {});
//       setTodaysRequests(res.data?.data?.[0]?.COUNT || "-");
//     } catch (error) {
//       console.error("Error fetching today's requests:", error);
//     }
//   };

//   const fetchActiveAssignments = async () => {
//     try {
//       const res = await apiService.post("pendingInspection", {
//         ulbid: user.ulbId,
//       });
//       setActiveAssignments(res.data?.data?.[0]?.COUNTT || "-");
//     } catch (error) {
//       console.error("Error fetching active assignments:", error);
//     }
//   };

//   const fetchJobsCompletedToday = async () => {
//     try {
//       const res = await apiService.post("jobsCompletedToday", {});
//       setJobsCompletedToday(res.data?.data?.[0]?.COUNTT || "-");
//     } catch (error) {
//       console.error("Error fetching Jobs Completed Today:", error);
//     }
//   };

//   const fetchTotalRevenue = async () => {
//     try {
//       const res = await apiService.post("todayrevenue", {});
//       const amount = res.data?.today_revenue?.[0]?.TODAY_REVENUE;
//       setTotalRevenue(amount ? `₹${amount}` : "₹-");
//     } catch (error) {
//       console.error("Error fetching revenue:", error);
//     }
//   };

//   // ⭐ NEW: Fetch top contractor API
//   const fetchTopContractors = async () => {
//     try {
//       const res = await apiService.post("getContractorDetails", {
//         contrulb: user.ulbId,
//       });

//       if (res.data?.success) {
//         const top5 = res.data.data.slice(0, 5);
//         setContractors(top5);
//       }
//     } catch (error) {
//       console.error("Error fetching contractor list:", error);
//     }
//   };

//   const fetchPendingRequests = async (apiDate) => {
//     console.log("Calling /getStageDetails with date:", apiDate);

//     try {
//       const res = await apiService.post("getStageDetails", { date: apiDate });
//       setPendingRequests(res.data?.data || []);
//       setCurrentPage(1);
//     } catch (error) {
//       console.error("Error fetching pending requests:", error);
//     }
//   };

//   // =====================================================
//   // PAGINATION LOGIC
//   // =====================================================
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = pendingRequests.slice(indexOfFirstRow, indexOfLastRow);

//   const nextPage = () => {
//     if (indexOfLastRow < pendingRequests.length) {
//       setCurrentPage((p) => p + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((p) => p - 1);
//     }
//   };

//   // =====================================================
//   // TABLE FORMATTERS
//   // =====================================================
//   const statusColors = {
//     "Requested": "bg-amber-500",
//     "Assigned for inspecte": "bg-blue-500",
//     "Inspecte": "bg-indigo-500",
//     "Completed": "bg-green-600",
//     "Bill Geneated": "bg-purple-600",
//     "Receipt Collection": "bg-teal-600",
//     "Job assigned": "bg-orange-600",
//     "N/A": "bg-gray-400",
//   };

//   const formattedPendingTableData = currentRows.map((item) => ({
//     requestId: item?.APPNO || "N/A",
//     location: item?.LOCATION || "N/A",
//     status: item?.STAGENAME || "N/A",
//   }));

//   // ⭐ NEW: Contractor table formatting
//   const topContractorsHeaders = ["Contractor Name", "Status", "Address"];

//   const topContractorsData = contractors.map((c) => ({
//     name: c.CONTRNAME,
//     flag: c.FLAG,
//     address: c.CONTRADDRESS,
//   }));

//   // =====================================================
//   // SUMMARY BOXES
//   // =====================================================
//   const summaryData = [
//     {
//       title: "Total Tanks Registered",
//       value: totalTanks,
//       icon: <Droplets className="h-8 w-8" />,
//       color: "bg-blue-500",
//     },
//     {
//       title: "Today's Requests",
//       value: todaysRequests,
//       icon: <Brush className="h-8 w-8" />,
//       color: "bg-green-500",
//     },
//     {
//       title: "Pending Inspections",
//       value: pendingInspections,
//       icon: <ClipboardList className="h-8 w-8" />,
//       color: "bg-orange-500",
//     },
//     {
//       title: "Active Assignments",
//       value: activeAssignments,
//       icon: <Truck className="h-8 w-8" />,
//       color: "bg-emerald-600",
//     },
//     {
//       title: "Jobs Completed Today",
//       value: jobsCompletedToday,
//       icon: <CheckCircle className="h-8 w-8" />,
//       color: "bg-green-600",
//     },
//     {
//       title: "Total Revenue",
//       value: totalRevenue,
//       icon: <IndianRupee className="h-8 w-8" />,
//       color: "bg-blue-600",
//     },
//   ];

//   const pendingRequestsHeaders = ["Request ID", "Location", "Status"];

//   const pendingRequestsRenderers = {
//     Status: (row) => (
//       <span
//         className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${
//           statusColors[row.status] || "bg-gray-400"
//         }`}
//       >
//         {row.status}
//       </span>
//     ),
//   };

//   // =====================================================
//   // RENDER UI
//   // =====================================================
//   return (
//     <div className="min-h-screen">
//       <p className="text-3xl font-bold text-gray-800 mb-6">Dashboard</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
//         {summaryData.map((card, index) => (
//           <Card
//             key={index}
//             className={`${card.color} text-white rounded-xl shadow-md transition-transform hover:scale-[1.02]`}
//           >
//             <CardContent className="flex flex-col items-center py-6">
//               {card.icon}
//               <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
//               <p className="text-sm opacity-90">{card.title}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* Pending Requests */}
//         <Card className="rounded-xl shadow-sm">
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle>Pending Requests</CardTitle>

//             <div className="w-40">
//               <CalendarIcon
//                 selectedDate={selectedDate}
//                 setSelectedDate={setSelectedDate}
//                 disablePastDates={false}
//                 autoSelectToday={true}
//               />
//             </div>
//           </CardHeader>

//           <CardContent>
//             <Table
//               headers={pendingRequestsHeaders}
//               data={formattedPendingTableData}
//               keyMapping={{
//                 "Request ID": "requestId",
//                 Location: "location",
//                 Status: "status",
//               }}
//               customRenderers={pendingRequestsRenderers}
//               showCheckboxInHeader={false}
//             />

//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
//               >
//                 Previous
//               </button>

//               <button
//                 onClick={nextPage}
//                 disabled={indexOfLastRow >= pendingRequests.length}
//                 className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ❤️ NEW: Top Contractors */}
//         <Card className="rounded-xl shadow-sm">
//           <CardHeader>
//             <CardTitle>Top 5 Contractors</CardTitle>
//           </CardHeader>

//           <CardContent>
//             <Table
//               headers={topContractorsHeaders}
//               data={topContractorsData}
//               keyMapping={{
//                 "Contractor Name": "name",
//                 Status: "flag",
//                 Address: "address",
//               }}
//               showCheckboxInHeader={false}
//             />
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Droplets,
  ClipboardList,
  Truck,
  CheckCircle,
  Brush,
  IndianRupee,
} from "lucide-react";
import apiService from "../../../apiService.js";
import Table from "../../Components/Table/Table";
import { useAuth } from "../../Context/AuthContext.jsx";
import CalendarIcon from "../../Components/Calendar/CalendarIcon.jsx";

// Convert Date → API Format
const formatToAPIDate = (date) => {
  if (!date) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(date.getDate()).padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

const Dashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    tanks: "-",
    pendingInspections: "-",
    todaysRequests: "-",
    activeAssignments: "-",
    jobsDoneToday: "-",
    revenue: "₹-",
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [contractors, setContractors] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // =====================================================================
  // LOAD ALL DASHBOARD DATA
  // =====================================================================
  useEffect(() => {
    if (!user?.ulbId) return;

    loadSummaryData();
    loadContractors();
    loadPendingRequests(formatToAPIDate(selectedDate));
  }, [user, selectedDate]);

  // =====================================================================
  // API HELPERS
  // =====================================================================
  const safeGet = (res, path, fallback = "-") =>
    path.split(".").reduce((o, k) => (o || {})[k], res) ?? fallback;

  const loadSummaryData = async () => {
    try {
      const [
        tanksRes,
        pendingRes,
        todayReqRes,
        activeRes,
        jobsDoneRes,
        revenueRes,
      ] = await Promise.all([
        apiService.post("totalTankRegister", {}),
        apiService.post("pendingCount", {}),
        apiService.post("todaysRequest", {}),
        apiService.post("pendingInspection", { ulbid: user.ulbId }),
        apiService.post("jobsCompletedToday", {}),
        apiService.post("todayrevenue", {}),
      ]);

      setSummary({
        tanks: safeGet(tanksRes, "data.data.0.COUNT"),
        pendingInspections: safeGet(pendingRes, "data.data.0.COUNTT"),
        todaysRequests: safeGet(todayReqRes, "data.data.0.COUNT"),
        activeAssignments: safeGet(activeRes, "data.data.0.COUNTT"),
        jobsDoneToday: safeGet(jobsDoneRes, "data.data.0.COUNTT"),
        revenue: "₹" + (safeGet(revenueRes, "data.today_revenue.0.TODAY_REVENUE", "-")),
      });
    } catch (err) {
      console.error("Summary Load Error:", err);
    }
  };

  const loadContractors = async () => {
    try {
      const res = await apiService.post("getContractorDetails", {
        contrulb: user.ulbId,
      });
      if (res.data?.success) setContractors(res.data.data.slice(0, 5));
    } catch (err) {
      console.error("Contractor Load Error:", err);
    }
  };

  const loadPendingRequests = async (date) => {
    try {
      const res = await apiService.post("getStageDetails", { date });
      setPendingRequests(res.data?.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Pending Requests Error:", err);
    }
  };

  // =====================================================================
  // TABLE FORMATTING
  // =====================================================================
  const pendingRows = pendingRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formattedPending = pendingRows.map((r) => ({
    requestId: r.APPNO ?? "N/A",
    location: r.LOCATION ?? "N/A",
    status: r.STAGENAME ?? "N/A",
  }));

  const contractorTable = contractors.map((c) => ({
    name: c.CONTRNAME,
    flag: c.FLAG,
    address: c.CONTRADDRESS,
  }));

  const statusColors = {
    Requested: "bg-amber-500",
    "Assigned for inspecte": "bg-blue-500",
    Inspecte: "bg-indigo-500",
    Completed: "bg-green-600",
    "Bill Geneated": "bg-purple-600",
    "Receipt Collection": "bg-teal-600",
    "Job assigned": "bg-orange-600",
    "N/A": "bg-gray-400",
  };

  const pendingStatusRenderer = {
    Status: (row) => (
      <span
        className={`px-3 py-1 text-xs text-white rounded-full ${
          statusColors[row.status] || "bg-gray-400"
        }`}
      >
        {row.status}
      </span>
    ),
  };

  // =====================================================================
  // SUMMARY CARD CONFIG
  // =====================================================================
  const summaryCards = [
    { title: "Total Tanks Registered", value: summary.tanks, icon: <Droplets />, color: "bg-blue-500" },
    { title: "Today's Requests", value: summary.todaysRequests, icon: <Brush />, color: "bg-green-500" },
    { title: "Pending Inspections", value: summary.pendingInspections, icon: <ClipboardList />, color: "bg-orange-500" },
    { title: "Active Assignments", value: summary.activeAssignments, icon: <Truck />, color: "bg-emerald-600" },
    { title: "Jobs Completed Today", value: summary.jobsDoneToday, icon: <CheckCircle />, color: "bg-green-600" },
    { title: "Total Revenue", value: summary.revenue, icon: <IndianRupee />, color: "bg-blue-600" },
  ];

  // =====================================================================
  // RENDER UI
  // =====================================================================
  return (
    <div className="min-h-screen">
      <p className="text-3xl font-bold text-gray-800 mb-6">Dashboard</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {summaryCards.map((card, i) => (
          <Card
            key={i}
            className={`${card.color} text-white rounded-xl shadow-md hover:scale-[1.02] transition-transform`}
          >
            <CardContent className="flex flex-col items-center py-6">
              <div className="h-8 w-8">{card.icon}</div>
              <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
              <p className="text-sm opacity-90">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending Requests */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Pending Requests</CardTitle>

            <div className="w-40">
              <CalendarIcon
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </CardHeader>

          <CardContent>
            <Table
              headers={["Request ID", "Location", "Status"]}
              data={formattedPending}
              keyMapping={{
                "Request ID": "requestId",
                Location: "location",
                Status: "status",
              }}
              customRenderers={pendingStatusRenderer}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  currentPage * rowsPerPage < pendingRequests.length &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage * rowsPerPage >= pendingRequests.length}
                className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Top Contractors */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Top 5 Contractors</CardTitle>
          </CardHeader>

          <CardContent>
            <Table
              headers={["Contractor Name", "Status", "Address"]}
              data={contractorTable}
              keyMapping={{
                "Contractor Name": "name",
                Status: "flag",
                Address: "address",
              }}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
