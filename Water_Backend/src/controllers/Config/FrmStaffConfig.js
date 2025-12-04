const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// 🔹 1️⃣ Get Staff Master List
const GetStaffListDtls = async (req, res) => {
  let connection;
  try {
    const { orgId, staffid } = req.body;

    connection = await getConnection();

    let query = `
      SELECT 
        num_staff_id AS staff_id,
        var_staff_name AS staff_name,
        var_staff_code AS staff_code,
        num_staff_mobno AS staff_mobno,
        var_staff_address AS staff_address,
        var_staff_flag AS staff_flag
      FROM aosp_staff_mas
      WHERE 1=1
    `;

    const binds = {};
    if (staffid && staffid !== "") {
      query += " AND num_staff_id = :staffid";
      binds.staffid = staffid;
    }

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching Staff List:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 2️⃣ Get Staff Config Details
const GetStaffConfigDtls = async (req, res) => {
  let connection;
  try {
    const { orgId, staffid } = req.body;

    connection = await getConnection();

    let query = `
      SELECT * 
      FROM vw_staffDtls 
      WHERE staff_ulbid = :orgId
    `;

    const binds = { orgId };

    if (staffid && staffid !== "") {
      query += " AND staffid = :staffid";
      binds.staffid = staffid;
    }

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching Staff Config Details:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};



const GetStaffById = async (req, res) => {
  let connection;
  try {
    const { staffid, orgId } = req.body;

    // 🔸 Validate required fields
    if (!staffid || !orgId) {
      return res.status(400).json({
        success: false,
        message: "staffid and orgId are required.",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        STAFFID AS staffid,
        STAFF_NAME AS staffname,
        STAFF_CODE AS staffcode,
        STAFF_MOBNO AS staffmobno,
        STAFF_ADDRESS AS staffaddress,
        FLAG AS status,
        CASE 
          WHEN FLAG = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag,
        STAFF_ULBID AS orgid,
        STAFF_INSDATE AS insdate
      FROM vw_staffDtls
      WHERE STAFF_ULBID = :orgId
        AND STAFFID = :staffid
    `;

    const result = await connection.execute(
      query,
      { orgId, staffid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No staff record found for the given staffid and orgId.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching staff details:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};





// 🔹 3️⃣ Insert Staff Config
const InsertStaffConfig = async (req, res) => {
  let connection;
  try {
    const { in_UserId, in_UlbId, in_staffconfigstr, in_ipaddress, in_source } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_staff_config_ins(
          :in_UserId,
          :in_UlbId,
          :in_staffconfigstr,
          :in_ipaddress,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      {
        in_UserId,
        in_UlbId,
        in_staffconfigstr,
        in_ipaddress,
        in_source,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
      }
    );

    const errorCode = result.outBinds.out_ErrorCode;
    const errorMsg = result.outBinds.out_ErrorMsg;

    res.json({
      success: true,
      errorCode,
      errorMsg,
    });
  } catch (err) {
    console.error("❌ Error in InsertStaffConfig:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  GetStaffListDtls,
  GetStaffConfigDtls,
  InsertStaffConfig,
  GetStaffById
};
