const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const uploadAssetMultiDocuments = async (req, res) => {
  try {
    console.log("✅ Received Asset Document Insert Request", req.body);

    const { assetId, docName, extension, docBase64, userId } = req.body;

    // --- 1. Required Field Validation ---
    if (!assetId || !docName || !extension || !docBase64 || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: assetId, docName, extension, docBase64, userId",
      });
    }

    // --- 2. Convert Base64 to Buffer ---
    const docBuffer = Buffer.from(docBase64, "base64");

    let connection;
    try {
      // --- 3. Get DB Connection ---
      connection = await getConnection();

      // --- 4. SQL Insert ---
      const query = `
        INSERT INTO aoam_assetdoc_det 
        (NUM_ASSETDOC_ID, NUM_ASSETDOC_ASSETID, VAR_ASSETDOC_NAME, VAR_ASSETDOC_EXTENSION, BLOB_ASSETDOC_DOC, VAR_ASSETDOC_INSBY, DAT_ASSETDOC_INSDATE) 
        VALUES (sq_docseq.Nextval, :assetId, :docName, :extension, :docBlob, :userId, SYSDATE)
      `;

      console.log("📝 Running Query:", query);

      const result = await connection.execute(
        query,
        {
          assetId,
          docName,
          extension,
          docBlob: { val: docBuffer, type: oracledb.BLOB, dir: oracledb.BIND_IN },
          userId,
        },
        { autoCommit: true }
      );

      console.log("✅ Insert Successful!", result);

      return res.status(200).json({
        success: true,
        message: "Asset Document inserted successfully.",
        rowsAffected: result.rowsAffected,
      });
    } catch (dbErr) {
      console.error("❌ DB Error:", dbErr);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: dbErr.message,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("⚠️ Error closing connection:", err);
        }
      }
    }
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


const insertAsset = async (req, res) => {
  let connection;
  try {
    console.log("✅ Received Asset Insert Request", req.body);
    const data = req.body;

    // Convert and sanitize
    const safeDate = (val) => (val ? new Date(val) : null);
    const safeNum = (val) => (val ? Number(val) : null);

    const bindVars = {
      in_userid: data.in_userid,
      in_Ulbid: safeNum(data.in_Ulbid),
      in_Deptid: safeNum(data.in_Deptid),
      in_asstypid: safeNum(data.in_asstypid),
      in_asssubtypid: safeNum(data.in_asssubtypid),
      in_Name: data.in_Name,
      in_datecr: safeDate(data.in_datecr),
      in_acquitypid: safeNum(data.in_acquitypid),
      in_acqfrom: data.in_acqfrom,
      in_POno: data.in_POno,
      in_orderdt: safeDate(data.in_orderdt),
      in_asslifespan: data.in_asslifespan,
      in_unitid: safeNum(data.in_unitid),
      in_Qty: safeNum(data.in_Qty),
      in_orgvalue: safeNum(data.in_orgvalue),
      in_itemstr: data.in_itemstr,
      in_Defliabappli: data.in_Defliabappli,
      in_Defliabperiod: data.in_Defliabperiod,
      in_Discription: data.in_Discription,
      in_docstr: data.in_docstr,
      in_insureance: data.in_insureance,
      in_insurencecompname: data.in_insurencecompname,
      in_insurancestartdate: safeDate(data.in_insurancestartdate),
      in_insurancevalue: data.in_insurancevalue,
      in_insurancepramount: safeNum(data.in_insurancepramount),
      in_insuranceenddate: safeDate(data.in_insuranceenddate),
      in_Mode: safeNum(data.in_Mode),
      in_ipaddress: data.in_ipaddress,
      in_source: data.in_source,
      Out_errorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      Out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
      Out_docstr: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
    };

    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        aoam_asset_ins(
          :in_userid,
          :in_Ulbid,
          :in_Deptid,
          :in_asstypid,
          :in_asssubtypid,
          :in_Name,
          :in_datecr,
          :in_acquitypid,
          :in_acqfrom,
          :in_POno,
          :in_orderdt,
          :in_asslifespan,
          :in_unitid,
          :in_Qty,
          :in_orgvalue,
          :in_itemstr,
          :in_Defliabappli,
          :in_Defliabperiod,
          :in_Discription,
          :in_docstr,
          :in_insureance,
          :in_insurencecompname,
          :in_insurancestartdate,
          :in_insurancevalue,
          :in_insurancepramount,
          :in_insuranceenddate,
          :in_Mode,
          :in_ipaddress,
          :in_source,
          :Out_errorCode,
          :Out_ErrorMsg,
          :Out_docstr
        );
      END;
      `,
      bindVars,
      { autoCommit: true }
    );

    res.status(200).json({
      success: true,
      errorCode: result.outBinds.Out_errorCode,
      message: result.outBinds.Out_ErrorMsg,
      docString: result.outBinds.Out_docstr,
    });
  } catch (err) {
    console.error("❌ Error executing procedure:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};


// Export both controllers
module.exports = {
  uploadAssetMultiDocuments,
  insertAsset,
};


