const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const GetOwnershiptypeListDtls = async (req, res) => {
  let connection;
  try {
    // You can read the body if you add filters later
    const body = req.body;

    connection = await getConnection();

    const query = `
      SELECT 
        num_ownertype_id AS ownershiptypeid, 
        var_ownertype_name AS ownertypename,
        CASE 
          WHEN var_ownertype_flag = 'Y' THEN 'Active' 
          ELSE 'Inactive' 
        END AS flag,
        var_ownertype_flag AS status,
        dat_ownertype_insdate AS ownertyinsdate
      FROM aosp_ownertype_mas
      ORDER BY var_ownertype_name
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching ownership type list:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const GetOwnershiptypeById = async (req, res) => {
  let connection;
  try {
    const { ownershiptypeid, orgId } = req.body;

    if (!ownershiptypeid || !orgId) {
      return res.status(400).json({
        success: false,
        message: "ownershiptypeid and orgId are required.",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        num_ownertype_id AS ownershiptypeid,
        var_ownertype_name AS ownertypename,
        var_ownertype_flag AS status,
        CASE 
          WHEN var_ownertype_flag = 'Y' THEN 'Active' 
          ELSE 'Inactive' 
        END AS flag,
        dat_ownertype_insdate AS ownertyinsdate
      FROM aosp_ownertype_mas
      WHERE num_ownertype_id = :ownershiptypeid
    `;

    const result = await connection.execute(
      query,
      { ownershiptypeid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ownership type found for the given ID and orgId.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching ownership type details:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};


const InsertOwnershipType = async (req, res) => {
  let connection;
  try {
    const {
      in_userid,
      in_mode,
      in_ownertypeid,
      in_ownertypename,
      in_ownertypeflag,
    } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_ownertype_ins(
          :in_userid,
          :in_mode,
          :in_ownertypeid,
          :in_ownertypename,
          :in_ownertypeflag,
          :out_errorcode,
          :out_errormsg
        );
      END;
      `,
      {
        in_userid: in_userid || null,
        in_mode: in_mode,
        in_ownertypeid: in_ownertypeid || null,
        in_ownertypename: in_ownertypename,
        in_ownertypeflag: in_ownertypeflag,

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
    console.error("❌ Error in ManageOwnershipType:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};



module.exports = { GetOwnershiptypeListDtls, InsertOwnershipType , GetOwnershiptypeById};
