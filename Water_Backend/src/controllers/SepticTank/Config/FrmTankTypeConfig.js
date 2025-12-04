const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// ✅ 1️⃣ Get Tank Type Master List
const getTankTypeListDtls = async (req, res) => {
  try {
    connection = await getConnection();

    const query = `
      SELECT 
        num_tanktype_id AS typeid,
        var_tanktype_name AS typename,
        CASE WHEN var_tanktype_flag = 'Y' THEN 'Active' ELSE 'Inactive' END AS flag,
        var_tanktype_flag AS status
      FROM aosp_tanktype_mas
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });

    await connection.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 2️⃣ Get Tank Type Config List by ULB
const getTankTypeConfigList = async (req, res) => {
  try {
    const { orgId } = req.body; // expects { "orgId": "123" }
    if (!orgId) {
      return res.status(400).json({ success: false, message: "orgId is required" });
    }

    connection = await getConnection();
    const query = `
      SELECT * FROM vw_Tanktypedtls WHERE ulbid = :orgId
    `;

    const result = await connection.execute(query, { orgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json({ success: true, data: result.rows });

    await connection.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ 3️⃣ Insert / Update / Delete Tank Type Config
const InsertTankTypeConfig = async (req, res) => {
  let connection;

  try {
    const { in_UserId, in_OrgId, in_TankTypeStr, in_Ipaddress, in_Source } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        AOSP_TANKTYPE_CONFIG_INS(
          :in_UserId,
          :in_OrgId,
          :in_TankTypeStr,
          :in_Ipaddress,
          :in_Source,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      {
        in_UserId: in_UserId || null,
        in_OrgId: in_OrgId || null,
        in_TankTypeStr: in_TankTypeStr || null,
        in_Ipaddress: in_Ipaddress || "127.0.0.1",
        in_Source: in_Source || "WEB",

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
    console.error("❌ Error in InsertTankTypeConfig:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

module.exports = {
  getTankTypeListDtls,
  getTankTypeConfigList,
  InsertTankTypeConfig,
};
