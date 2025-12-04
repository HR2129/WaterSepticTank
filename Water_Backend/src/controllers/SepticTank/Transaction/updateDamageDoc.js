const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

async function updateAssetDamageDoc(req, res) {
  try {
    console.log("✅ Received Asset Damage Doc Update Request", req.body);

    // Extract request data
    const { docBase64, damageId } = req.body;

    // Validate required fields
    if (!docBase64 || !damageId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: docBase64 or damageId",
      });
    }

    // Convert Base64 string to Buffer
    const DocBuffer = Buffer.from(docBase64, "base64");

    // Get DB connection
    const connection = await getConnection();

    // Prepare SQL query
    const query = `
      UPDATE aoam_AssetDamage_mas
      SET blob_assetdamage_doc = :BLOBDoc
      WHERE num_assetdamage_id = :damageId
    `;

    console.log("📝 Running Query:", query);
    console.log("🔢 Parameters:", { damageId });

    // Execute query with bind variables
    const result = await connection.execute(
      query,
      {
        BLOBDoc: { val: DocBuffer, type: oracledb.BLOB, dir: oracledb.BIND_IN },
        damageId,
      },
      { autoCommit: true }
    );

    console.log("✅ Update Successful!", result);

    // Close connection
    await connection.close();

    // Send response
    res.json({
      success: true,
      message: "Asset Damage document updated successfully.",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("❌ Error updating asset damage doc:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = updateAssetDamageDoc;
