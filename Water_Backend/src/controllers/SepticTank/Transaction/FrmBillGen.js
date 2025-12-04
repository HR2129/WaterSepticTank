const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const prabhagDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const { ulbid } = req.body; // ✅ now reading from body

    if (!ulbid) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: ulbid",
      });
    }

    const sqlQuery = `
      SELECT DISTINCT 
        zonename AS PrabhagName,
        zoneid AS PrabhagId
      FROM 
        prop.vw_zonemas
      WHERE 
        ulbid = :ulbid
      ORDER BY 
        zonename ASC
    `;

    const result = await connection.execute(sqlQuery, { ulbid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      success: true,
      message: "Prabhag data fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in prabhagDropdown:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prabhag data",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in prabhagDropdown:", err);
      }
    }
  }
};

const tankRequestByNoC = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const { tankNo } = req.body;
    if (!tankNo) {
      return res.status(400).json({
        success: false,
        message: "tankNo is required",
      });
    }

    const sql = `
      SELECT 
        num_request_id, 
        num_request_tnkid, 
        var_request_status
      FROM 
        aosp_tnkrequest_mst
      WHERE 
        var_request_no = :tankNo 
        AND var_request_status = 'C'
    `;

    const result = await connection.execute(
      sql,
      { tankNo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({
      success: true,
      message: "Tank request details fetched successfully for status C",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in tankRequestByNoC:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tank request details for status C",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};



const tankRequestByNoBG = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const { tankNo } = req.body;
    if (!tankNo) {
      return res.status(400).json({
        success: false,
        message: "tankNo is required",
      });
    }

    const sql = `
      SELECT 
        num_request_id, 
        num_request_tnkid, 
        var_request_status
      FROM 
        aosp_tnkrequest_mst
      WHERE 
        var_request_no = :tankNo 
        AND var_request_status = 'BG'
    `;

    const result = await connection.execute(
      sql,
      { tankNo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({
      success: true,
      message: "Tank request details fetched successfully for status BG",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in tankRequestByNoBG:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tank request details for status BG",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};



const ZoneDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { orgId, prabhagId } = req.body;

    if (!orgId || !prabhagId) return res.status(400).json({ success: false, message: "orgId and prabhagId required" });

    const sql = `
      SELECT DISTINCT wardname, wardid
      FROM prop.vw_zonemas
      WHERE ulbid = :orgId AND zoneid = :prabhagId
    `;

    const result = await connection.execute(sql, { orgId, prabhagId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in wardListByPrabhag:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const distanceRate = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { distance, orgId } = req.body;

    if (!distance || !orgId) return res.status(400).json({ success: false, message: "distance and orgId required" });

    const sql = `
      SELECT NVL(num_rate_rate, 0) AS rate
      FROM aosp_rate_mas
      INNER JOIN aosp_rate_config ON num_rate_rateid = num_rate_id
      WHERE var_rate_typecode = 'D'
      AND (:distance BETWEEN num_rate_slabfrom AND num_rate_slabto)
      AND num_rate_ulbid = :orgId
    `;

    const result = await connection.execute(sql, { distance, orgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in distanceRate:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const wasteRate = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { waste, orgId } = req.body;

    if (!waste || !orgId) return res.status(400).json({ success: false, message: "waste and orgId required" });

    const sql = `
      SELECT NVL(num_rate_rate, 0) AS rate
      FROM aosp_rate_mas
      INNER JOIN aosp_rate_config ON num_rate_rateid = num_rate_id
      WHERE var_rate_typecode = 'W'
      AND (:waste BETWEEN num_rate_slabfrom AND num_rate_slabto)
      AND num_rate_ulbid = :orgId
    `;

    const result = await connection.execute(sql, { waste, orgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in wasteRate:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};




const tankRequestFullDetails = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { orgId, tankrqstid } = req.body;

    if (!orgId || !tankrqstid)
      return res.status(400).json({ success: false, message: "orgId and tankrqstid required" });

    const sql = `
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
      FROM vw_tankdtls tnkdtls
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
      WHERE tnkdtls.tank_ulbid = :orgId
      AND tnkrqsdtls.num_request_id = :tankrqstid
    `;

    const result = await connection.execute(sql, { orgId, tankrqstid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in tankRequestFullDetails:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};



const TankBillInsert = async (req, res) => {
  let connection;

  try {
    const {
      userid,
      request_id,
      tankid,
      prabhagid,
      zoneid,
      distance,
      waste,
      distamt,
      wasteamt,
      total,
      billgendate,
      ulbid,
    } = req.body;

    // ✅ Input validation
    if (!request_id || !tankid || !prabhagid || !zoneid || !ulbid) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: request_id, tankid, prabhagid, zoneid, ulbid.",
      });
    }

    connection = await getConnection();

    // ✅ Define bind parameters (matching your stored procedure aosp_billgen_ins)
    const binds = {
      in_UserId: userid || null,
      in_request_id: request_id,
      in_tankid: tankid,
      in_prabhagid: prabhagid,
      in_zoneid: zoneid,
      in_distance: distance || null,
      in_waste: waste || null,
      in_distamt: distamt || null,
      in_wasteamt: wasteamt || null,
      in_total: total || null,
      in_billgendate: billgendate ? new Date(billgendate) : new Date(),
      in_ulbid: ulbid,
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
    };

    // ✅ Execute stored procedure
    const result = await connection.execute(
      `
      BEGIN
        aosp_billgen_ins(
          :in_UserId,
          :in_request_id,
          :in_tankid,
          :in_prabhagid,
          :in_zoneid,
          :in_distance,
          :in_waste,
          :in_distamt,
          :in_wasteamt,
          :in_total,
          :in_billgendate,
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
    console.error("❌ Error in TankBillInsert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to execute Tank Bill Insert procedure.",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in TankBillInsert:", err);
      }
    }
  }
};




module.exports = { prabhagDropdown, tankRequestByNoC, tankRequestByNoBG, ZoneDropdown, distanceRate, wasteRate, tankRequestFullDetails,TankBillInsert };
