const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

// 🔹 Get Rate Configuration List
const GetRateListDtls = async (req, res) => {
  let connection;
  try {
    const { orgid, contrid } = req.body;

    connection = await getConnection();

    let query = `SELECT * FROM vw_rateconfigdtls WHERE rate_ulbid = :orgid`;
    const binds = { orgid };

    if (contrid && contrid.trim() !== "") {
      query += " AND rate_id = :contrid";
      binds.contrid = contrid;
    }

    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching rate list:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

const GetRateById = async (req, res) => {
  let connection;
  try {
    const { rateId, orgId } = req.body;

    // 🔸 Validation
    if (!rateId || !orgId) {
      return res.status(400).json({
        success: false,
        message: "rateid and orgid are required.",
      });
    }

    connection = await getConnection();

    const query = `
     SELECT 
        RATE_ID AS rateId,
        RATE_TYPE AS ratetype,
        RATE_SLABFROM AS slabfrom,
        RATE_SLABTO AS slabto,
        RATE_AMOUNT AS rateamount,
        FLAG AS status,
        CASE 
          WHEN FLAG = 'Y' THEN 'Active'
          ELSE 'Inactive'
        END AS flag,
        RATE_ULBID AS orgid,
        RATE_INSDATE AS insdate
      FROM vw_rateconfigdtls
      WHERE RATE_ULBID = :orgId
        AND RATE_ID = :rateId
    `;

    const result = await connection.execute(query, { rateId, orgId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rate record found for the given ID and orgid.",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching rate details:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// 🔹 Insert / Update / Delete Rate Configuration
const InsertRateConfig = async (req, res) => {
  let connection;
  try {
    const { in_userid, in_mode, in_rate_id, in_typecode, in_slabfrom, in_slabto, in_rate, in_flag } = req.body;

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aosp_rate_ins(
          :in_userid,
          :in_mode,
          :in_rate_id,
          :in_typecode,
          :in_slabfrom,
          :in_slabto,
          :in_rate,
          :in_flag,
          :out_errorcode,
          :out_errormsg
        );
      END;
      `,
      {
        in_userid: in_userid || null,
        in_mode: in_mode,
        in_rate_id: in_rate_id || null,
        in_typecode: in_typecode || null,
        in_slabfrom: in_slabfrom || null,
        in_slabto: in_slabto || null,
        in_rate: in_rate || null,
        in_flag: in_flag || "Y",

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
    console.error("❌ Error in InsertRateConfig:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) await connection.close();
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
      message: "Corporation data fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in getCorporationData:", err);
    res.status(500).json({ error: "Failed to fetch corporation data", details: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in getCorporationData:", err);
      }
    }
  }
};

module.exports = { GetRateListDtls, InsertRateConfig, CorporationDropdown, GetRateById };
