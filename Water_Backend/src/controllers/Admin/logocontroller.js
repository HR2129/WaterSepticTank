const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

// =============================================================
// ✅ 1. Fetch Corporation Details (Logo + Name)
// =============================================================
const fetchCorporationDetails = async (req, res) => {
  let connection;

  try {
    const { ulbid } = req.params;

    if (!ulbid) {
      return res.status(400).json({
        success: false,
        message: "ulbid is required in the URL.",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT 
        var_corporation_name AS corporationName,
        blob_corporation_img AS corporationLogo
      FROM admins.aoma_corporation_mas
      WHERE num_corporation_id = :ulbId
    `;

    const result = await connection.execute(
      query,
      { ulbId: parseInt(ulbid) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Corporation data not found",
      });
    }

    const { CORPORATIONNAME, CORPORATIONLOGO } = result.rows[0];
    let logoBase64 = null;

    if (CORPORATIONLOGO) {
      const blobData = await CORPORATIONLOGO.getData();
      logoBase64 = `data:image/png;base64,${Buffer.from(blobData).toString(
        "base64"
      )}`;
    }

    res.json({
      success: true,
      data: {
        ULBLOGO: logoBase64,
        ABC_MUNICIPAL_TEXT: CORPORATIONNAME,
      },
    });
  } catch (error) {
    console.error("Error fetching corporation details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle DB connection:", err);
      }
    }
  }
};

// =============================================================
// ✅ 2. Fetch Asset Total Values
// =============================================================
const getAssetTotalValues = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const query = "SELECT * FROM vw_assettotalvalues";
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Asset Total Values:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// =============================================================
// ✅ 3. Fetch Movable Asset Data
// =============================================================
const getAssetMovable = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const query = "SELECT * FROM prop.vw_assetmovable";
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Movable Assets:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// =============================================================
// ✅ 4. Fetch Asset Insurance Details
// =============================================================
const getAssetInsurance = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const query = "SELECT * FROM VW_ASSETINSUREANCE";
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Asset Insurance Details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// =============================================================
// ✅ 5. Fetch Asset Department Details
// =============================================================
const getAssetDeptDetails = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const query = "SELECT * FROM vw_assetdeptdet";
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Asset Department Details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// =============================================================
// ✅ 6. Fetch Asset Policies Near Expiry
// =============================================================
const getAssetPoliciesNearExpiry = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const query = "SELECT * FROM vw_assetpolicies_nearexpiry";
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Asset Policies Near Expiry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// =============================================================
// ✅ 7. Fetch Asset Valuation (Monthwise)
// =============================================================
const getAssetValuationMonthwise = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const query = "SELECT * FROM vw_assetvaluation_monthwise";
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      totalRecords: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Asset Valuation (Monthwise):", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// =============================================================
// ✅ Export All Functions
// =============================================================
module.exports = {
  fetchCorporationDetails,
  getAssetTotalValues,
  getAssetMovable,
  getAssetInsurance,
  getAssetDeptDetails,
  getAssetPoliciesNearExpiry,
  getAssetValuationMonthwise,
};
