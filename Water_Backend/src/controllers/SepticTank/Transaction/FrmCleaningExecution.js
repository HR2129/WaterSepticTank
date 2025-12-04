oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");
const multer = require("multer");

const WasteTypeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const sqlQuery = `
      SELECT 
        var_wastetype_name AS WasteTypeName,
        num_wastetype_id AS WasteTypeId
      FROM 
        aosp_wastetype_mas
      WHERE 
        var_wastetype_flag = 'Y'
      ORDER BY 
        var_wastetype_name ASC
    `;

    const result = await connection.execute(sqlQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.status(200).json({
      message: "Waste type data fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in WasteTypeDropdown:", err);
    res.status(500).json({
      error: "Failed to fetch waste type data",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in WasteTypeDropdown:", err);
      }
    }
  }
};

const tnkCleaningInsert = async (req, res) => {
  let connection;
  try {
    const { userId, requestId, clngDate, startTime, endTime, wasteCollected, wasteTypeId, clngRemark, clngStatus, orgId } = req.body;

    // Validate required fields
    if (!userId || !requestId || !clngDate || !startTime || !endTime || !wasteCollected || !wasteTypeId || !clngStatus || !orgId) {
      return res.status(400).json({
        success: false,
        message: "userId, requestId, clngDate, startTime, endTime, wasteCollected, wasteTypeId, clngStatus, and orgId are required.",
      });
    }

    connection = await getConnection();

    const result = await connection.execute(
      `
        BEGIN
          aosp_tnkCleaning_ins(
            :in_UserId,
            :in_request_id,
            TO_DATE(:in_clngdate, 'YYYY-MM-DD'),
            :in_starttime,
            :in_endtime,
            :in_wastecltd,
            :in_wastetypeid,
            :in_clngremark,
            :in_clngstatus,
            :in_ulbid,
            :out_ErrorCode,
            :out_ErrorMsg
          );
        END;
      `,
      {
        in_UserId: userId,
        in_request_id: requestId,
        in_clngdate: clngDate,
        in_starttime: startTime,
        in_endtime: endTime,
        in_wastecltd: wasteCollected,
        in_wastetypeid: wasteTypeId,
        in_clngremark: clngRemark || null,
        in_clngstatus: clngStatus,
        in_ulbid: orgId,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
      }
    );

    const { out_ErrorCode, out_ErrorMsg } = result.outBinds;

    if (out_ErrorCode === 9999) {
      res.status(200).json({
        success: true,
        message: out_ErrorMsg,
      });
    } else {
      res.status(400).json({
        success: false,
        message: out_ErrorMsg || "Procedure execution failed.",
      });
    }
  } catch (err) {
    console.error("Error in tnkCleaningInsert:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in tnkCleaningInsert:", err);
      }
    }
  }
};



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function updateSepticTankImage(req, res) {
  try {
    console.log("✅ Received Septic Tank Image Update Request");

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    // Extract parameters from form-data body
    const { requestId, mode } = req.body;
    if (!requestId || !mode) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: requestId or mode",
      });
    }

    console.log("🧾 Received Params:", { requestId, mode });

    // Get image buffer from multer
    const imgBuffer = req.file.buffer;

    // Prepare SQL query based on mode
    const query =
      mode === "1"
        ? `UPDATE aosp_tnkcleaning_dtls 
           SET blob_tnkcleaning_before = :imgBlob 
           WHERE num_tnkcleaning_id = :requestId`
        : `UPDATE aosp_tnkcleaning_dtls 
           SET blob_tnkcleaning_after = :imgBlob 
           WHERE num_tnkcleaning_id = :requestId`;

    // Get DB connection
    const connection = await getConnection();

    // Execute query
    const result = await connection.execute(
      query,
      {
        imgBlob: { val: imgBuffer, type: oracledb.BLOB, dir: oracledb.BIND_IN },
        requestId,
      },
      { autoCommit: true }
    );

    console.log("✅ Image updated successfully:", result.rowsAffected);

    await connection.close();

    res.json({
      success: true,
      message: mode === "1" ? "Before photo updated" : "After photo updated",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("❌ Error updating septic tank image:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = { WasteTypeDropdown, tnkCleaningInsert, updateSepticTankImage, upload  };
