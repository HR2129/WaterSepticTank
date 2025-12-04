const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// ----------------------------------------------------------
// 1️⃣ Fetch Zone List by OrgId
// ----------------------------------------------------------
const getZoneList = async (req, res) => {
  let connection;
  try {
    const { OrgId } = req.body;
    if (!OrgId) return res.status(400).json({ success: false, message: "OrgId is required" });

    connection = await getConnection();

    const sql = `
      SELECT DISTINCT zonename, zoneid 
      FROM prop.vw_zonemas 
      WHERE ulbid = :OrgId
    `;

    const result = await connection.execute(sql, { OrgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching zones:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 2️⃣ Fetch Owner Type List
// ----------------------------------------------------------
const getOwnerTypeList = async (req, res) => {
  let connection;
  try {
    const { OrgId } = req.body;
    if (!OrgId) return res.status(400).json({ success: false, message: "OrgId is required" });

    connection = await getConnection();

    const sql = `
      SELECT ownertypename, ownershiptypeid 
      FROM vw_ownertypedtls 
      WHERE status='Y' AND ulbid=:OrgId
    `;

    const result = await connection.execute(sql, { OrgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching owner types:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 3️⃣ Fetch Tank Type List
// ----------------------------------------------------------
const getTankTypeList = async (req, res) => {
  let connection;
  try {
    const { OrgId } = req.body;
    if (!OrgId) return res.status(400).json({ success: false, message: "OrgId is required" });

    connection = await getConnection();

    const sql = `
      SELECT typename, typeid 
      FROM vw_tanktypedtls 
      WHERE status='Y' AND ulbid=:OrgId
    `;

    const result = await connection.execute(sql, { OrgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching tank types:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 4️⃣ Fetch Service Type List
// ----------------------------------------------------------
const getServiceTypeList = async (req, res) => {
  let connection;
  try {
    const { OrgId } = req.body;
    if (!OrgId) return res.status(400).json({ success: false, message: "OrgId is required" });

    connection = await getConnection();

    const sql = `
      SELECT servtype_name, servtype_id 
      FROM vw_servicetypedtls 
      WHERE servtype_flag='Active' AND servicetype_ulbid=:OrgId
    `;

    const result = await connection.execute(sql, { OrgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching service types:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 5️⃣ Fetch Ward List by Zone
// ----------------------------------------------------------
const getWardListByZone = async (req, res) => {
  let connection;
  try {
    const { OrgId, ZoneId } = req.body;
    if (!OrgId || !ZoneId)
      return res.status(400).json({ success: false, message: "OrgId and ZoneId are required" });

    connection = await getConnection();

    const sql = `
      SELECT DISTINCT wardname, wardid 
      FROM prop.vw_zonemas 
      WHERE ulbid=:OrgId AND zoneid=:ZoneId
    `;

    const result = await connection.execute(sql, { OrgId, ZoneId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching wards:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 6️⃣ Fetch Tank Request Details by Request No
// ----------------------------------------------------------
const getTankRequestByRequestNo = async (req, res) => {
  let connection;
  try {
    const { OrgId, RequestNo } = req.body;
    if (!OrgId || !RequestNo)
      return res.status(400).json({ success: false, message: "OrgId and RequestNo are required" });

    connection = await getConnection();

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
        CASE 
            WHEN var_request_status = 'R'  THEN 'Requested'
            WHEN var_request_status = 'AI' THEN 'Assigned for inspecte'
            WHEN var_request_status = 'IR' THEN 'Inspecte rejected'
            WHEN var_request_status = 'IA' THEN 'Inspecte approved'
            WHEN var_request_status = 'JA' THEN 'Job assigned'
            WHEN var_request_status = 'PC' THEN 'Partially Completed'
            WHEN var_request_status = 'C'  THEN 'Completed'
            WHEN var_request_status = 'BG' THEN 'Bill Generated'
            WHEN var_request_status = 'RC' THEN 'Receipt Collected'
        END AS request_status
      FROM vw_tankdtls tnkdtls
      INNER JOIN aosp_tnkrequest_mst tnkrqsdtls 
        ON num_request_tnkid = tank_id
      INNER JOIN vw_servicetypedtls 
        ON servtype_id = tnkrqsdtls.num_request_servid 
        AND servicetype_ulbid = tnkdtls.tank_ulbid
      WHERE tnkdtls.tank_ulbid = :OrgId
        AND tnkrqsdtls.var_request_no = :RequestNo
    `;

    const result = await connection.execute(sql, { OrgId, RequestNo }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching request by request no:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 7️⃣ Fetch Tank Request Details by Mobile No
// ----------------------------------------------------------
const getTankRequestByMobile = async (req, res) => {
  let connection;
  try {
    const { OrgId, MobileNo } = req.body;
    if (!OrgId || !MobileNo)
      return res.status(400).json({ success: false, message: "OrgId and MobileNo are required" });

    connection = await getConnection();

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
        CASE 
            WHEN var_request_status = 'R'  THEN 'Requested'
            WHEN var_request_status = 'AI' THEN 'Assigned for inspecte'
            WHEN var_request_status = 'IR' THEN 'Inspecte rejected'
            WHEN var_request_status = 'IA' THEN 'Inspecte approved'
            WHEN var_request_status = 'JA' THEN 'Job assigned'
            WHEN var_request_status = 'PC' THEN 'Partially Completed'
            WHEN var_request_status = 'C'  THEN 'Completed'
            WHEN var_request_status = 'BG' THEN 'Bill Generated'
            WHEN var_request_status = 'RC' THEN 'Receipt Collected'
        END AS request_status
      FROM vw_tankdtls tnkdtls
      INNER JOIN aosp_tnkrequest_mst tnkrqsdtls 
        ON num_request_tnkid = tank_id
      INNER JOIN vw_servicetypedtls 
        ON servtype_id = tnkrqsdtls.num_request_servid 
        AND servicetype_ulbid = tnkdtls.tank_ulbid
      WHERE tnkdtls.tank_ulbid = :OrgId
        AND tnkdtls.tank_mobile = :MobileNo
    `;

    const result = await connection.execute(sql, { OrgId, MobileNo }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching request by mobile no:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

// ----------------------------------------------------------
// 8️⃣ Fetch Application Tracking Details
// ----------------------------------------------------------
const getApplicationTracking = async (req, res) => {
  let connection;
  try {
    const { OrgId, RequestId } = req.body;
    if (!OrgId || !RequestId)
      return res.status(400).json({ success: false, message: "OrgId and RequestId are required" });

    connection = await getConnection();

    const sql = `
      SELECT 
          mas.num_tnkapplitrack_id AS stageid, 
          mas.var_tnkapplitrack_step AS step,
          NVL(det.var_applitrack_remark, '') AS description,
          NVL(det.dat_applitrack_insdt, '') AS datetime,
          NVL(det.var_applitrack_status, 'Pending') AS status,
          'WEB' AS source,
          NVL(det.dat_applitrack_insdt, '') AS dt,
          NVL(det.num_applitrack_ulbid, '890') AS ULBID,
          NVL(var_request_no, '') AS APPNO
      FROM aosp_tnkapplitrack_mas mas
      LEFT JOIN (
          SELECT *
          FROM aosp_applitracking_det
          WHERE num_applitrack_reqtid = :RequestId
            AND num_applitrack_ulbid = :OrgId
      ) det
          ON mas.var_tnkapplitrack_code = det.var_applitrack_stagecode
      LEFT JOIN aosp_tnkrequest_mst
          ON num_request_id = NVL(det.num_applitrack_reqtid, :RequestId)
      ORDER BY mas.num_tnkapplitrack_id
    `;

    const result = await connection.execute(sql, { OrgId, RequestId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching tracking details:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.close();
  }
};
const insertOrUpdateTankRequest = async (req, res) => {
  let connection;
  try {
    const {
      userId,
      mode,            // 1=Insert, 2=Update, 3=Delete
      requestId,
      tankId,
      ownerName,
      mobile,
      emailId,
      address,
      prabhagId,
      zoneId,
      tankTypeId,
      ownerTypeId,
      capacity,
      propNo,
      latitude,
      longitude,
      regDate,
      flag,
      reqDate,
      servId,
      reqstBy,
      remark,
      source,
      status,
      orgId,
    } = req.body;

    // ✅ Parameter validation
    if (!userId || !mode || !orgId) {
      return res.status(400).json({
        success: false,
        message: "userId, mode, and orgId are required.",
      });
    }

    connection = await getConnection();

    // ✅ Execute Oracle procedure
    const result = await connection.execute(
      `
      BEGIN
        aosp_tnkrequest_ins(
          :in_UserId,
          :in_mode,
          :in_request_id,
          :in_tnkid,
          :in_ownername,
          :in_mobile,
          :in_emailid,
          :in_address,
          :in_prabhagid,
          :in_zoneid,
          :in_tnktypeid,
          :in_ownertypeid,
          :in_capacity,
          :in_propno,
          :in_latitude,
          :in_longitude,
          TO_DATE(:in_regdate, 'YYYY-MM-DD'),
          :in_flag,
          TO_DATE(:in_reqdate, 'YYYY-MM-DD'),
          :in_servid,
          :in_reqstby,
          :in_remark,
          :in_source,
          :in_status,
          :in_ulbid,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      {
        in_UserId: userId,
        in_mode: mode,
        in_request_id: requestId || null,
        in_tnkid: tankId || null,
        in_ownername: ownerName || null,
        in_mobile: mobile || null,
        in_emailid: emailId || null,
        in_address: address || null,
        in_prabhagid: prabhagId || null,
        in_zoneid: zoneId || null,
        in_tnktypeid: tankTypeId || null,
        in_ownertypeid: ownerTypeId || null,
        in_capacity: capacity || null,
        in_propno: propNo || null,
        in_latitude: latitude || null,
        in_longitude: longitude || null,
        in_regdate: regDate || null,
        in_flag: flag || null,
        in_reqdate: reqDate || null,
        in_servid: servId || null,
        in_reqstby: reqstBy || null,
        in_remark: remark || null,
        in_source: source || null,
        in_status: status || null,
        in_ulbid: orgId,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
      }
    );

    const { out_ErrorCode, out_ErrorMsg } = result.outBinds;

    // ✅ Response handling
    if (out_ErrorCode === 9999) {
      res.status(200).json({
        success: true,
        message: out_ErrorMsg,
      });
    } else {
      res.status(400).json({
        success: false,
        message: out_ErrorMsg || "Procedure execution failed.",
      });
    }
  } catch (err) {
    console.error("Error in insertOrUpdateTankRequest:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};


const CorporationDropdown = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const sqlQuery = `
            SELECT
                num_corporation_id AS CorpId,
                var_corporation_name AS Corpname
            FROM
                admins.aoma_corporation_mas
            ORDER BY
                var_corporation_name ASC -- Added an order by for consistent results
        `;

        const result = await connection.execute(
            sqlQuery,
            [], // No bind variables needed for this query
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // Return rows as JavaScript objects
        );

        res.status(200).json({
            message: 'Corporation data fetched successfully',
            data: result.rows
        });

    } catch (err) {
        console.error('Error in getCorporationData:', err);
        res.status(500).json({ error: 'Failed to fetch corporation data', details: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection in getCorporationData:', err);
            }
        }
    }
};


module.exports = {
  getZoneList,
  getOwnerTypeList,
  getTankTypeList,
  getServiceTypeList,
  getWardListByZone,
  getTankRequestByRequestNo,
  getTankRequestByMobile,
  getApplicationTracking,
  insertOrUpdateTankRequest,
  CorporationDropdown
};
