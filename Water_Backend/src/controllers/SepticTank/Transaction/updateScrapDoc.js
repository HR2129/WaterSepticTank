const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

async function updateScrapDoc(req, res) {
  try {
    console.log("✅ Received Scrap Doc Update Request", req.body);

    // Extract request data
    const { docBase64, scrapId } = req.body;

    // Validate required fields
    if (!docBase64 || !scrapId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: docBase64 or scrapId",
      });
    }

    // Convert Base64 string to Buffer
    const DocBuffer = Buffer.from(docBase64, "base64");

    // Get DB connection
    const connection = await getConnection();

    // Prepare SQL query
    const query = `
      UPDATE aoam_scrap_mas
      SET var_scrap_doc = :BLOBDoc
      WHERE num_scrap_id = :scrapId
    `;

    console.log("📝 Running Query:", query);
    console.log("🔢 Parameters:", { scrapId });

    // Execute query with bind variables
    const result = await connection.execute(
      query,
      {
        BLOBDoc: { val: DocBuffer, type: oracledb.BLOB, dir: oracledb.BIND_IN },
        scrapId,
      },
      { autoCommit: true }
    );

    console.log("✅ Update Successful!", result);

    // Close connection
    await connection.close();

    // Send response
    res.json({
      success: true,
      message: "Scrap document updated successfully.",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("❌ Error updating scrap doc:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = updateScrapDoc;
