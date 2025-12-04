const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// 🔹 1️⃣ Get Contractor Master List
const GetContractorListDtls = async (req, res) => {
  let connection;
  try {
    const { orgId, contrid } = req.body;

    connection = await getConnection();

    let query = `
      SELECT 
        num_contractor_id AS contrid,
        var_contractor_name AS contrname,
        num_contractor_mobno AS contrmobno,
        var_contractor_address AS contraddress,
        CASE 
          WHEN var_contractor_flag = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag,
        var_contractor_flag AS status,
        dat_contractor_insdate AS contrinsdate
      FROM aosp_contractor_mas
      WHERE 1=1
    `;

    const binds = {};
    if (contrid && contrid !== "") {
      query += " AND num_contractor_id = :contrid";
      binds.contrid = contrid;
    }

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching Contractor List:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 2️⃣ Get Contractor Config List
const GetContractorConfigDtls = async (req, res) => {
  let connection;
  try {
    const { orgId, contrid } = req.body;

    connection = await getConnection();

    let query = `
      SELECT * 
      FROM vw_contractordtls 
      WHERE contrulb = :orgId
    `;

    const binds = { orgId };

    if (contrid && contrid !== "") {
      query += " AND contrid = :contrid";
      binds.contrid = contrid;
    }

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching Contractor Config Details:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 3️⃣ Insert Contractor Config
const InsertContractorConfig = async (req, res) => {
  let connection;
  try {
    const { in_UserId, in_OrgId, in_contractorconfigstr, in_Ipaddress, in_Source } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_contractor_config_ins(
          :in_UserId,
          :in_OrgId,
          :in_contractorconfigstr,
          :in_Ipaddress,
          :in_Source,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      {
        in_UserId,
        in_OrgId,
        in_contractorconfigstr,
        in_Ipaddress,
        in_Source,
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
    console.error("❌ Error in InsertContractorConfig:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  GetContractorListDtls,
  GetContractorConfigDtls,
  InsertContractorConfig,
};
