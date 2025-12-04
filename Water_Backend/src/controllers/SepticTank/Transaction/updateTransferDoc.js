const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const aoam_assetTransfer_ins = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const {
      in_userid,
      in_Ulbid,
      in_assetid,
      in_olddeptid,
      in_newdeptid,
      in_transordno,
      in_transdt,
      in_Handoverto,
      in_Mode,
      in_ipaddress,
      in_source
    } = req.body;

    // Convert string to JS Date
    const parsedDate = in_transdt ? new Date(in_transdt) : null;

    const bindVars = {
      in_userid,
      in_Ulbid,
      in_assetid,
      in_olddeptid,
      in_newdeptid,
      in_transordno,
      in_transdt: { val: parsedDate, type: oracledb.DATE },
      in_Handoverto,
      in_Mode,
      in_ipaddress,
      in_source,
      Out_errorCode: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      Out_ErrorMsg: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 500 },
      Out_Transferid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    };

    const result = await connection.execute(
      `BEGIN 
        aoam_assetTransfer_ins(
          :in_userid,
          :in_Ulbid,
          :in_assetid,
          :in_olddeptid,
          :in_newdeptid,
          :in_transordno,
          :in_transdt,
          :in_Handoverto,
          :in_Mode,
          :in_ipaddress,
          :in_source,
          :Out_errorCode,
          :Out_ErrorMsg,
          :Out_Transferid
        ); 
      END;`,
      bindVars,
      { autoCommit: true }
    );

    res.json({
      OUT_ERRORCODE: result.outBinds.Out_errorCode,
      OUT_ERRORMSG: result.outBinds.Out_ErrorMsg,
      OUT_TRANSFERID: result.outBinds.Out_Transferid
    });

  } catch (error) {
    console.error("❌ Error executing aoam_assetTransfer_ins:", error);
    res.status(500).json({
      OUT_ERRORCODE: -500,
      OUT_ERRORMSG: "Internal Server Error while transferring asset",
      ERROR: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("❌ Error closing Oracle connection:", closeErr);
      }
    }
  }
};

async function updateTransferDoc(req, res) {
  try {
    console.log("✅ Received Transfer Doc Update Request", req.body);

    // Extract request data
    const { docBase64, transferId } = req.body;

    // Validate required fields
    if (!docBase64 || !transferId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: docBase64 or transferId",
      });
    }

    // Convert Base64 string to Buffer
    const DocBuffer = Buffer.from(docBase64, "base64");

    // Get DB connection
    const connection = await getConnection();

    // Prepare SQL query
    const query = `
      UPDATE aoam_transfer_mas
      SET var_trans_doc = :BLOBDoc
      WHERE num_trans_id = :transferId
    `;

    console.log("📝 Running Query:", query);
    console.log("🔢 Parameters:", { transferId });

    // Execute query with bind variables
    const result = await connection.execute(
      query,
      {
        BLOBDoc: { val: DocBuffer, type: oracledb.BLOB, dir: oracledb.BIND_IN },
        transferId,
      },
      { autoCommit: true }
    );

    console.log("✅ Update Successful!", result);

    // Close connection
    await connection.close();

    // Send response
    res.json({
      success: true,
      message: "Transfer document updated successfully.",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("❌ Error updating transfer doc:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = {updateTransferDoc, aoam_assetTransfer_ins};
