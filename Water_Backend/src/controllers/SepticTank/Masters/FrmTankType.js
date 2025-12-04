const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const getTankTypeListDtls = async (req, res) => {
  let connection;
  try {
    // You can still read body if needed for future filters
    const body = req.body;

    connection = await getConnection();

    const query = `
      SELECT 
        num_tanktype_id AS typeid, 
        var_tanktype_name AS typename,
        CASE 
          WHEN var_tanktype_flag = 'Y' THEN 'Active' 
          ELSE 'InActive' 
        END AS flag,
        var_tanktype_flag AS status
      FROM aosp_tanktype_mas
      ORDER BY var_tanktype_name
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching tank type list:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};




const getTankTypeById = async (req, res) => {
  let connection;
  try {
    const { tanktypeid } = req.body;

    if (!tanktypeid) {
      return res.status(400).json({ success: false, message: "tanktypeid is required" });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        num_tanktype_id AS typeid,
        var_tanktype_name AS typename,
        var_tanktype_flag AS status,
        CASE 
          WHEN var_tanktype_flag = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag
      FROM aosp_tanktype_mas
      WHERE num_tanktype_id = :tanktypeid
    `;

    const result = await connection.execute(
      query,
      { tanktypeid },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tank type found for the given ID",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching tank type by ID:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};





const InsertTankType = async (req, res) => {
  let connection;
  try {
    const { userid, tanktypeid, tanktypename, tanktypeflag, mode } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_tanktype_ins(
          :in_userid,
          :in_mode,
          :in_tanktypeid,
          :in_tanktypename,
          :in_tanktypeflag,
          :out_errorcode,
          :out_errormsg
        );
      END;
      `,
      {
        in_userid: userid,
        in_mode: mode,
        in_tanktypeid: tanktypeid || null,
        in_tanktypename: tanktypename,
        in_tanktypeflag: tanktypeflag,
        out_errorcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_errormsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
      }
    );

    res.json({
      success: true,
      errorCode: result.outBinds.out_errorcode,
      errorMsg: result.outBinds.out_errormsg,
    });
  } catch (err) {
    console.error("❌ Error managing tank type:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { getTankTypeListDtls, InsertTankType, getTankTypeById };
