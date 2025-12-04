const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// 🔹 Get Staff List Details
const GetStaffListDtls = async (req, res) => {
  let connection;
  try {
    const body = req.body; // for future filters if needed

    connection = await getConnection();

    const query = `
      SELECT 
        num_staff_id AS staffid,
        var_staff_name AS staffname,
        var_staff_code AS staffcode,
        num_staff_mobno AS staffmobno,
        var_staff_address AS staffaddress,
        CASE 
          WHEN var_staff_flag = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag,
        var_staff_flag AS status
      FROM aosp_staff_mas
      ORDER BY var_staff_name
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching staff list:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 Insert / Update / Delete Staff Details
const InsertStaff = async (req, res) => {
  let connection;
  try {
    const { in_userid, in_mode, in_staff_id, in_staff_name, in_staff_code, in_staff_mobno, in_staff_address, in_staff_flag } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_staff_ins(
          :in_userid,
          :in_mode,
          :in_staff_id,
          :in_staff_name,
          :in_staff_code,
          :in_staff_mobno,
          :in_staff_address,
          :in_staff_flag,
          :out_errorcode,
          :out_errormsg
        );
      END;
      `,
      {
        in_userid: in_userid || null,
        in_mode: in_mode,
        in_staff_id: in_staff_id || null,
        in_staff_name: in_staff_name,
        in_staff_code: in_staff_code || null,
        in_staff_mobno: in_staff_mobno || null,
        in_staff_address: in_staff_address || null,
        in_staff_flag: in_staff_flag || "Y",

        out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_errormsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
      }
    );

    const errorCode = result.outBinds.out_errorcode;
    const errorMsg = result.outBinds.out_errormsg;

    res.json({
      success: true,
      errorCode,
      errorMsg,
    });
  } catch (err) {
    console.error("❌ Error in InsertStaff:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { GetStaffListDtls, InsertStaff };
