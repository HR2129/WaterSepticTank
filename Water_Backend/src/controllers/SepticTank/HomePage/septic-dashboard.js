const oracledb = require("oracledb");
const { getConnection }= require("../../../config/database");


const getStageDetails = async (req, res) => {
  let connection;

  try {
    const { date } = req.body; // incoming date from Postman

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT 
        det.num_applitrack_ulbid AS ulbid,
        NVL(var_request_no, '') AS APPNO,
        '' AS location,
        var_applitrack_stagename AS stagename
      FROM septmgmt.aosp_tnkapplitrack_mas mas
      LEFT JOIN septmgmt.aosp_applitracking_det det 
          ON mas.var_tnkapplitrack_code = det.var_applitrack_stagecode
      LEFT JOIN septmgmt.aosp_tnkrequest_mst 
          ON num_request_id = det.num_applitrack_reqtid
      WHERE TRUNC(det.dat_applitrack_insdt) = TO_DATE(:p_date, 'DD-Mon-YYYY')
      `,
      { p_date: date }
    );

    return res.json({ success: true, data: result.rows });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

const totalTankRegister = async (req, res) => {
  let connection;

  try {
     connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT num_request_ulbid AS ulbid,
             COUNT(*) AS count
      FROM septmgmt.aosp_tnkrequest_mst
      GROUP BY num_request_ulbid
      `
    );

    return res.json({ success: true, data: result.rows });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};
const todaysRequest = async (req, res) => {
  let connection;

  try {
  

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT num_request_ulbid AS ulbid,
             COUNT(*) AS count
      FROM septmgmt.aosp_tnkrequest_mst
    
      GROUP BY num_request_ulbid
      `,
      
    );

    return res.json({ success: true, data: result.rows });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

const pendingCount = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT num_applitrack_ulbid AS ulbid,
             COUNT(*) AS countt
      FROM septmgmt.aosp_applitracking_det
      WHERE var_applitrack_status IS NULL
      GROUP BY num_applitrack_ulbid
      `
    );

    return res.json({ success: true, data: result.rows });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};
const pendingInspection = async (req, res) => {
  let connection;

  try {
    const { ulbid } = req.body;  // get ulbid from request

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT num_applitrack_ulbid AS ulbid,
             COUNT(*) AS countt
      FROM septmgmt.aosp_applitracking_det
      WHERE var_applitrack_stagename <> 'Completed'
        AND num_applitrack_ulbid = :p_ulbid
      GROUP BY num_applitrack_ulbid
      `,
      { p_ulbid: ulbid } // bind parameter
    );

    return res.json({ success: true, data: result.rows });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};


const jobsCompletedToday = async (req, res) => {
  let connection;

  try {


    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT num_applitrack_ulbid AS ulbid,
             COUNT(*) AS countt
      FROM septmgmt.aosp_applitracking_det
      WHERE 
         var_applitrack_stagename = 'Completed'
      GROUP BY num_applitrack_ulbid
      `,
   
    );

    return res.json({ success: true, data: result.rows });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};


const getTodayRevenue = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
        SELECT 
          SUM(num_bill_total) AS today_revenue
        FROM 
          septmgmt.aosp_bill_mas
       
      `
    );

    return res.json({
      success: true,
      today_revenue: result.rows 
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const getContractorDetails = async (req, res) => {
  let connection;

  try {
    const { contrulb } = req.body; // dynamic ULB ID

    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT *
      FROM septmgmt.vw_contractordtls
      WHERE contrulb = :contrulb
      `,
      { contrulb }
    );

    return res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};


module.exports = {
  getStageDetails,
  totalTankRegister,
  todaysRequest,
  pendingCount,
  pendingInspection,
  jobsCompletedToday,
  getTodayRevenue,
  getContractorDetails
};
