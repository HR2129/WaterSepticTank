const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const getTankRequestList = async (req, res) => {
  let connection;

  try {
    const { orgId, status } = req.body;

    if (!orgId || !status) {
      return res.status(400).json({
        success: false,
        message: "orgId and status are required parameters.",
      });
    }

    connection = await getConnection();

    // ✔ Only the JA → JA+PC logic (as you requested)
    let statusCondition = "";
    let bindParams = { orgId };

    if (status === "JA") {
      statusCondition = " AND var_request_status IN ('JA', 'PC')";
    } else {
      statusCondition = " AND var_request_status = :status";
      bindParams.status = status;
    }

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
        CASE 
          WHEN var_request_status = 'R'  THEN 'Requested'
          WHEN var_request_status = 'AI' THEN 'Assigned for inspecte'
          WHEN var_request_status = 'IR' THEN 'Inspecte rejected'
          WHEN var_request_status = 'IA' THEN 'Inspecte approved'
          WHEN var_request_status = 'JA' THEN 'Job assigned'
          WHEN var_request_status = 'PC' THEN 'Partially Completed'
          WHEN var_request_status = 'C'  THEN 'Completed'
        END AS request_status
      FROM 
        vw_tankdtls tnkdtls
      INNER JOIN 
        aosp_tnkrequest_mst tnkrqsdtls 
        ON num_request_tnkid = tank_id
      INNER JOIN 
        vw_servicetypedtls 
        ON servtype_id = tnkrqsdtls.num_request_servid 
        AND servicetype_ulbid = tnkdtls.tank_ulbid
      WHERE 
        tnkdtls.tank_ulbid = :orgId
        ${statusCondition}
    `;

    const result = await connection.execute(query, bindParams);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error("Error fetching tank requests:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};



const getStaffList = async (req, res) => {
  let connection;
  try {
    const { orgId } = req.body;
    if (!orgId)
      return res
        .status(400)
        .json({ success: false, message: "orgId is required." });

    connection = await getConnection();
    const query = `
      SELECT staff_name, staffid 
      FROM vw_staffdtls 
      WHERE status='Y' AND staff_ulbid = :orgId
    `;
    const result = await connection.execute(query, { orgId });
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in getStaffList:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const getTankConditionList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT var_tnkcnd_name, num_tnkcnd_id 
      FROM aosp_tnkcondition_mas 
      WHERE var_tnkcnd_flag = 'Y'
    `;
    const result = await connection.execute(query);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching tank condition list:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const getAccessDifficultyList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT var_acsdifcty_name, num_acsdifcty_id 
      FROM aosp_Accessdifficulty_mas 
      WHERE var_acsdifcty_flag = 'Y'
    `;
    const result = await connection.execute(query);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching access difficulty list:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const getTankRequestDetailsById = async (req, res) => {
  let connection;
  try {
    const { orgId, requestId } = req.body;

    if (!orgId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "orgId and requestId are required.",
      });
    }

    connection = await getConnection();
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
          CASE WHEN dat_request_visitdate IS NOT NULL  
              THEN TO_CHAR(dat_request_visitdate, 'DD/MM/YYYY') 
              ELSE NULL END AS visitdate
      FROM vw_tankdtls tnkdtls 
      INNER JOIN aosp_tnkrequest_mst tnkrqsdtls ON num_request_tnkid = tank_id 
      INNER JOIN vw_servicetypedtls ON servtype_id = tnkrqsdtls.num_request_servid 
          AND servicetype_ulbid = tnkdtls.tank_ulbid 
      WHERE tnkdtls.tank_ulbid = :orgId 
      AND tnkrqsdtls.num_request_id = :requestId
    `;

    const result = await connection.execute(query, { orgId, requestId });
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in getTankRequestDetailsById:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const assignInspection = async (req, res) => {
  let connection;
  try {
    const { userId, requestId, tankId, visitDate, staffId, orgId } = req.body;

    if (!userId || !requestId || !tankId || !visitDate || !staffId || !orgId) {
      return res.status(400).json({
        success: false,
        message:
          "userId, requestId, tankId, visitDate, staffId, and orgId are required.",
      });
    }

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_tnkvisit_ins(
          :in_UserId,
          :in_request_id,
          :in_tnkid,
          TO_DATE(:in_visitdate, 'YYYY-MM-DD'),
          :in_staffid,
          :in_ulbid,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
    `,
      {
        in_UserId: userId,
        in_request_id: requestId,
        in_tnkid: tankId,
        in_visitdate: visitDate,
        in_staffid: staffId,
        in_ulbid: orgId,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
      }
    );

    const { out_ErrorCode, out_ErrorMsg } = result.outBinds;

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
    console.error("Error in assignInspection:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};




const tnkInspectionIns = async (req, res) => {
  let connection;
  try {
    const {
      userId,
      requestId,
      tankId,
      visitDate,
      staffId,
      tnkCondition,
      tnkAccessDifty,
      wasteLevel,
      remark,
      status,
      orgId
    } = req.body;

    // ✅ Validation
    if (
      !userId ||
      !requestId ||
      !tankId ||
      !visitDate ||
      !staffId ||
      !tnkCondition ||
      !tnkAccessDifty ||
      !wasteLevel ||
      !status ||
      !orgId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (userId, requestId, tankId, visitDate, staffId, tnkCondition, tnkAccessDifty, wasteLevel, status, orgId) must be provided.",
      });
    }

    // ✅ Get connection
    connection = await getConnection();

    // ✅ Execute PL/SQL procedure
    const result = await connection.execute(
      `
      BEGIN
        aosp_tnkinspection_ins(
          :in_UserId,
          :in_request_id,
          :in_tnkid,
          TO_DATE(:in_visitdate, 'YYYY-MM-DD'),
          :in_staffid,
          :in_tnkcondition,
          :in_tnkaccessdifty,
          :in_wastelevel,
          :in_remark,
          :in_status,
          :in_ulbid,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      {
        in_UserId: userId,
        in_request_id: Number(requestId),
        in_tnkid: Number(tankId),
        in_visitdate: visitDate,
        in_staffid: Number(staffId),
        in_tnkcondition: Number(tnkCondition),
        in_tnkaccessdifty: Number(tnkAccessDifty),
        in_wastelevel: Number(wasteLevel),
        in_remark: remark || null,
        in_status: status,
        in_ulbid: Number(orgId),
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
      }
    );

    const { out_ErrorCode, out_ErrorMsg } = result.outBinds;

    // ✅ Handle response based on ErrorCode
    if (out_ErrorCode === 9999) {
      res.status(200).json({
        success: true,
        message: out_ErrorMsg || "Inspection details inserted successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: out_ErrorMsg || "Procedure execution failed.",
      });
    }
  } catch (err) {
    console.error("❌ Error in tnkInspectionIns:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};




module.exports = {
  getTankRequestList,
  getStaffList,
  getTankConditionList,
  getAccessDifficultyList,
  getTankRequestDetailsById,
  assignInspection,
  tnkInspectionIns
};
