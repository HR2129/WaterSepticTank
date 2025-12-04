const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// 🔹 Get Contractor List Details
const GetContractorListDtls = async (req, res) => {
  let connection;
  try {
    const body = req.body; // for future filters if needed

    connection = await getConnection();

    const query = `
      SELECT 
        num_contractor_id AS contractorid,
        var_contractor_name AS contractorname,
        num_contractor_mobno AS contractormobno,
        var_contractor_address AS contractoraddress,
        CASE 
          WHEN var_contractor_flag = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag,
        var_contractor_flag AS status,
        dat_contractor_insdate AS contractorinsdate
      FROM aosp_contractor_mas
      ORDER BY var_contractor_name
    `;

    const result = await connection.execute(query, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching contractor list:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

const GetContractorById = async (req, res) => {
  let connection;
  try {
    const { contractorid, orgId } = req.body;

    if (!contractorid || !orgId) {
      return res.status(400).json({
        success: false,
        message: "contractorid and orgId are required.",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        num_contractor_id AS contractorid,
        var_contractor_name AS contractorname,
        num_contractor_mobno AS contractormobno,
        var_contractor_address AS contractoraddress,
        var_contractor_flag AS status,
        CASE 
          WHEN var_contractor_flag = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag,
        dat_contractor_insdate AS contractorinsdate
      FROM aosp_contractor_mas
      WHERE num_contractor_id = :contractorid
    `;

    const result = await connection.execute(query, { contractorid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contractor found for the given ID and orgId.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching contractor details:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const InsertContractor = async (req, res) => {
  let connection;
  try {
    const { in_userid, in_mode, in_contractor_id, in_contractor_name, in_contractor_mobno, in_contractor_address, in_contractor_flag } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN 
                aosp_contractor_ins( 
                    :in_userid, 
                    :in_mode, 
                    :in_contractor_id, 
                    :in_contractor_name, 
                    :in_contractor_mobno, 
                    :in_contractor_address, 
                    :in_contractor_flag, 
                    :out_errorcode, 
                    :out_errormsg 
                ); 
            END;`,
      {
        in_userid: in_userid || null,
        in_mode: in_mode,
        in_contractor_id: in_contractor_id || null,
        in_contractor_name: in_contractor_name,
        in_contractor_mobno: in_contractor_mobno || null,
        in_contractor_address: in_contractor_address || null,
        in_contractor_flag: in_contractor_flag,
        out_errorcode: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
        out_errormsg: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 300,
        },
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
    console.error("❌ Error in InsertContractor:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { GetContractorListDtls, InsertContractor, GetContractorById };
