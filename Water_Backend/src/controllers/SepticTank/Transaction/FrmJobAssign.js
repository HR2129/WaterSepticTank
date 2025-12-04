const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const StaffDropdown = async (req, res) => {
  let connection;
  try {
    const { orgId } = req.body;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "orgId is required.",
      });
    }

    connection = await getConnection();

    const sqlQuery = `
      SELECT
        staff_name AS staffname,
        staffid AS staffid
      FROM
        vw_staffdtls
      WHERE
        status = 'Y'
        AND staff_ulbid = :orgId
      ORDER BY
        staff_name ASC
    `;

    const result = await connection.execute(
      sqlQuery,
      { orgId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({
      message: "Active staff list fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in StaffDropdown:", err);
    res.status(500).json({
      error: "Failed to fetch active staff data",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in StaffDropdown:", err);
      }
    }
  }
};


const VehicleDropdown = async (req, res) => {
  let connection;
  try {
    const { orgId } = req.body;

    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "orgId is required.",
      });
    }

    connection = await getConnection();

    const sqlQuery = `
      SELECT
        vehicle_no AS vehicleno,
        vehicle_id AS vehicleid
      FROM
        vw_vehicleconfig
      WHERE
        status = 'Y'
        AND ulb = :orgId
      ORDER BY
        vehicle_no ASC
    `;

    const result = await connection.execute(
      sqlQuery,
      { orgId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({
      message: "Active vehicle list fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in VehicleDropdown:", err);
    res.status(500).json({
      error: "Failed to fetch active vehicle data",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in VehicleDropdown:", err);
      }
    }
  }
};

const GetTankRequestDtlsNew = async (req, res) => {
  let connection;

  try {
    const { orgId, tankrqstid } = req.body;

    // ✅ Validate required inputs
    if (!orgId || !tankrqstid) {
      return res.status(400).json({
        success: false,
        message: "orgId and tankrqstid are required.",
      });
    }

    connection = await getConnection();

    // ✅ SQL query (converted from your C# version)
    const query = `
      SELECT 
        tnkdtls.*, 
        tnkrqsdtls.num_request_id AS reqstid, 
        tnkrqsdtls.var_request_no,
        tnkrqsdtls.dat_request_date,
        tnkrqsdtls.num_request_servid,
        servtype_name,
        tnkrqsdtls.var_request_reqstby,
        tnkrqsdtls.var_request_remark,
        num_request_staffid,
        num_requestdtl_staffid AS staffid,
        staff_name,
        TO_CHAR(dat_requestdtl_visitdate, 'DD/MM/YYYY') AS visitdate,
        num_requestdtl_tnkcdnid AS tnkcdnid,
        var_tnkcdn_name AS tnkcdn_name,
        num_requestdtl_acsdftyid AS acsdftyid,
        var_acsdifcty_name AS acsdifcty_name,
        num_requestdtl_wastelevel AS wastelevel,
        var_requestdtl_remark AS remark,
        num_tnkjob_distance AS distance,
        num_tnkcleaning_wastecollected AS wastecollected,
        tnkdtls.tank_prabhagid,
        tnkdtls.prabhagname,
        tnkdtls.tank_zoneid,
        tnkdtls.zonename,
        num_bill_total
      FROM 
        vw_tankdtls tnkdtls
        INNER JOIN aosp_tnkrequest_mst tnkrqsdtls ON num_request_tnkid = tank_id
        INNER JOIN vw_servicetypedtls ON servtype_id = tnkrqsdtls.num_request_servid
          AND servicetype_ulbid = tnkdtls.tank_ulbid
        INNER JOIN aosp_tnkrequest_dtls ON num_requestdtl_reqstid = num_request_id
          AND num_requestdtl_ulbid = tnkdtls.tank_ulbid
        INNER JOIN aosp_tankcondition_mas ON num_tnkcdn_id = num_requestdtl_tnkcdnid
        INNER JOIN vw_staffdtls ON staffid = num_requestdtl_staffid
          AND staff_ulbid = tnkdtls.tank_ulbid
        INNER JOIN aosp_accessdifficulty_mas ON num_acsdifcty_id = num_requestdtl_acsdftyid
        LEFT JOIN aosp_tnkcleaning_dtls ON num_tnkcleaning_reqstid = num_request_id
        LEFT JOIN aosp_tnkjobassign_dtls ON num_tnkjob_reqstid = num_request_id
        LEFT JOIN aosp_bill_mas ON num_bill_requestid = num_request_id
      WHERE 
        tnkdtls.tank_ulbid = :orgId
        AND tnkrqsdtls.num_request_id = :tankrqstid
    `;

    // ✅ Execute query
    const result = await connection.execute(
      query,
      { orgId, tankrqstid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // ✅ Return response
    res.status(200).json({
      success: true,
      message: "Tank request details fetched successfully.",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching tank request details:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tank request details.",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in GetTankRequestDtlsNew:", err);
      }
    }
  }
};

const TankJobInsert = async (req, res) => {
  let connection;

  try {
    const {
      userid,
      request_id,
      staffid,
      Vehicleid,
      Assigndate,
      Distance,
      Time,
      Remark,
      ulbid,
    } = req.body;

    // ✅ Input validation
    if (!request_id || !staffid || !Vehicleid || !Assigndate || !ulbid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: request_id, staffid, Vehicleid, Assigndate, ulbid.",
      });
    }

    connection = await getConnection();

    // ✅ Define bind parameters (matching your stored procedure exactly)
    const binds = {
      in_UserId: userid || null,
      in_request_id: request_id,
      in_staffid: staffid,
      in_Vehicleno: Vehicleid,
      in_assigndate: new Date(Assigndate),
      in_distance: Distance || null,
      in_time: Time || null,
      in_remark: Remark || null,
      in_ulbid: ulbid,
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
    };

    // ✅ Execute stored procedure
    const result = await connection.execute(
      `
      BEGIN
        aosp_tnkjobassign_ins(
          :in_UserId,
          :in_request_id,
          :in_staffid,
          :in_Vehicleno,
          :in_assigndate,
          :in_distance,
          :in_time,
          :in_remark,
          :in_ulbid,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      binds
    );

    // ✅ Extract output parameters
    const errorCode = result.outBinds.out_ErrorCode;
    const errorMsg = result.outBinds.out_ErrorMsg;

    res.status(200).json({
      success: errorCode === 0,
      errorCode,
      message: errorMsg,
    });
  } catch (err) {
    console.error("❌ Error in TankJobInsert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to execute Tank Job Insert procedure.",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in TankJobInsert:", err);
      }
    }
  }
};
module.exports = { StaffDropdown ,VehicleDropdown, GetTankRequestDtlsNew, TankJobInsert};
