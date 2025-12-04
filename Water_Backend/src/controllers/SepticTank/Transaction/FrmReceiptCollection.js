const oracledb = require("oracledb");
const { getConnection } = require("../../../config/database");

const PayModeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { ulbid } = req.body;

    // ✅ Validation
    if (!ulbid) return res.status(400).json({ success: false, message: "ulbid is required" });

    const sql = `
      SELECT recmodname, recmodeid
      FROM prop.vw_recmodeconfig
      WHERE ulbid = :ulbid
    `;

    const result = await connection.execute(sql, { ulbid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error in PayModeDropdown:", err);
    res.status(500).json({ success: false, message: "Failed to fetch pay modes", error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

const BankNameDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { ulbid } = req.body;

    // ✅ Input validation
    if (!ulbid) return res.status(400).json({ success: false, message: "ulbid is required" });

    const sql = `
      SELECT bank_name, bank_id
      FROM prop.vw_bankconfig
      WHERE ulbid = :ulbid
    `;

    const result = await connection.execute(sql, { ulbid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    res.json({
      success: true,
      message: "Bank name data fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in BankNameDropdown:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bank name data",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};


const GetBillDetailsByBillNoRC = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { billNo } = req.body;

    if (!billNo) {
      return res.status(400).json({
        success: false,
        message: "billNo is required",
      });
    }

    const sql = `
      SELECT 
          num_request_id,
          num_request_tnkid,
          var_request_status,
          num_bill_id,
          num_bill_total
      FROM 
          aosp_tnkrequest_mst
      INNER JOIN 
          aosp_bill_mas 
          ON num_bill_requestid = num_request_id
      WHERE 
          var_bill_billno = :billNo
          AND var_request_status = 'RC'
    `;

    const result = await connection.execute(
      sql,
      { billNo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No RC records found for the given Bill Number.",
      });
    }

    res.json({
      success: true,
      message: "Bill details fetched successfully (RC)",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in GetBillDetailsByBillNoRC:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch RC bill details",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};


const GetBillDetailsByBillNoBG = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { billNo } = req.body;

    if (!billNo) {
      return res.status(400).json({
        success: false,
        message: "billNo is required",
      });
    }

    const sql = `
      SELECT 
          num_request_id,
          num_request_tnkid,
          var_request_status,
          num_bill_id,
          num_bill_total
      FROM 
          aosp_tnkrequest_mst
      INNER JOIN 
          aosp_bill_mas 
          ON num_bill_requestid = num_request_id
      WHERE 
          var_bill_billno = :billNo
          AND var_request_status = 'BG'
    `;

    const result = await connection.execute(
      sql,
      { billNo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No BG records found for the given Bill Number.",
      });
    }

    res.json({
      success: true,
      message: "Bill details fetched successfully (BG)",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in GetBillDetailsByBillNoBG:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch BG bill details",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};





const GetTankDetailsByRequestId = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { orgId, tankrqstid } = req.body;

    // ✅ Input validation
    if (!orgId || !tankrqstid) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: orgId or tankrqstid",
      });
    }

    const sql = `
      SELECT 
          tnkdtls.*,
          tnkrqsdtls.num_request_id AS reqstid,
          tnkrqsdtls.var_request_no,
          tnkrqsdtls.dat_request_date,
          tnkrqsdtls.num_request_servid,
          servtype_name,
          tnkrqsdtls.var_request_reqstby,
          tnkrqsdtls.var_request_remark,
          num_request_staffid,
          num_requestdtl_staffid AS staffid,
          staff_name,
          TO_CHAR(dat_requestdtl_visitdate, 'DD/MM/YYYY') AS visitdate,
          num_requestdtl_tnkcdnid AS tnkcdnid,
          var_tnkcdn_name AS tnkcdn_name,
          num_requestdtl_acsdftyid AS acsdftyid,
          var_acsdifcty_name AS acsdifcty_name,
          num_requestdtl_wastelevel AS wastelevel,
          var_requestdtl_remark AS remark,
          num_tnkjob_distance AS distance,
          num_tnkcleaning_wastecollected AS wastecollected,
          tnkdtls.tank_prabhagid,
          tnkdtls.prabhagname,
          tnkdtls.tank_zoneid,
          tnkdtls.zonename,
          num_bill_total
      FROM 
          vw_tankdtls tnkdtls
          INNER JOIN aosp_tnkrequest_mst tnkrqsdtls 
              ON num_request_tnkid = tank_id
          INNER JOIN vw_servicetypedtls 
              ON servtype_id = tnkrqsdtls.num_request_servid 
              AND servicetype_ulbid = tnkdtls.tank_ulbid
          INNER JOIN aosp_tnkrequest_dtls 
              ON num_requestdtl_reqstid = num_request_id 
              AND num_requestdtl_ulbid = tnkdtls.tank_ulbid
          INNER JOIN aosp_tankcondition_mas 
              ON num_tnkcdn_id = num_requestdtl_tnkcdnid
          INNER JOIN vw_staffdtls 
              ON staffid = num_requestdtl_staffid 
              AND staff_ulbid = tnkdtls.tank_ulbid
          INNER JOIN aosp_accessdifficulty_mas 
              ON num_acsdifcty_id = num_requestdtl_acsdftyid
          LEFT JOIN aosp_tnkcleaning_dtls 
              ON num_tnkcleaning_reqstid = num_request_id
          LEFT JOIN aosp_tnkjobassign_dtls 
              ON num_tnkjob_reqstid = num_request_id
          LEFT JOIN aosp_bill_mas 
              ON num_bill_requestid = num_request_id
      WHERE 
          tnkdtls.tank_ulbid = :orgId
          AND tnkrqsdtls.num_request_id = :tankrqstid
    `;

    const result = await connection.execute(sql, { orgId, tankrqstid }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tank details found for given parameters",
      });
    }

    res.json({
      success: true,
      message: "Tank details fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in GetTankDetailsByRequestId:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tank details",
      error: err.message,
    });
  } finally {
    if (connection) await connection.close();
  }
};

const GetTankReceiptByRecNo = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const { recNo, orgId } = req.body;

    // ✅ Input validation
    if (!recNo || !orgId) {
      return res.status(400).json({
        success: false,
        message: "Both recNo and orgId are required.",
      });
    }

    const sql = `
      SELECT 
          ULBID,
          OWNERNAME,
          MOBILE,
          EMAILID,
          ADDRESS,
          RECMODNAME,
          BANK_NAME,
          REFNO,
          RECNO,
          RECEIPTDT,
          CHEQNO,
          CHECKDT,
          AMOUNT
      FROM 
          vw_tnkreceipt
      WHERE 
          RECNO = :recNo
          AND ULBID = :orgId
    `;

    // ✅ Execute query
    const result = await connection.execute(
      sql,
      { recNo, orgId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // ✅ Handle no results
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No receipt details found for the given RecNo and OrgId.",
      });
    }

    // ✅ Success response
    res.json({
      success: true,
      message: "Receipt details fetched successfully.",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in GetTankReceiptByRecNo:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipt details.",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in GetTankReceiptByRecNo:", err);
      }
    }
  }
};


const GetPayCodeByPayMode = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const { payId, ulbId } = req.body;

    // ✅ Input validation
    if (!payId || !ulbId) {
      return res.status(400).json({
        success: false,
        message: "Both payId and ulbId are required.",
      });
    }

    const sql = `
      SELECT 
          var_recmode_paycode
      FROM 
          prop.aoms_recmodeconfig_mas
      INNER JOIN 
          prop.aoms_recmode_mas 
          ON num_recmode_id = num_recmodeconfig_recmodeid
      WHERE 
          num_recmode_id = :payId
          AND num_recmodeeconfig_ulbid = :ulbId
    `;

    // ✅ Execute query
    const result = await connection.execute(
      sql,
      { payId, ulbId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // ✅ Handle no results
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pay code found for the given payId and ulbId.",
      });
    }

    // ✅ Success response
    res.json({
      success: true,
      message: "Pay code fetched successfully.",
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ Error in GetPayCodeByPayMode:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pay code details.",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in GetPayCodeByPayMode:", err);
      }
    }
  }
};


const TankReceiptInsert = async (req, res) => {
  let connection;

  try {
    const {
      userid,
      request_id,
      tankid,
      billid,
      prabhagid,
      zoneid,
      refno,
      paymode,
      bankname,
      checkno,
      checkdt,
      recdt,
      remark,
      amount,
      ulbid,
      source,
    } = req.body;

    // ✅ Input validation
    if (!tankid || !billid || !ulbid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: tankid, billid, ulbid.",
      });
    }

    connection = await getConnection();

    // ✅ Define bind parameters
    const binds = {
      in_UserId: userid || null,
      in_request_id: request_id || null,
      in_tankid: tankid,
      in_billid: billid,
      in_prabhagid: prabhagid || null,
      in_zoneid: zoneid || null,
      in_refno: refno || null,
      in_paymode: paymode || null,
      in_bankname: bankname || null,
      in_checkno: checkno || null,
      in_checkdt: checkdt ? new Date(checkdt) : null,
      in_recdt: recdt ? new Date(recdt) : new Date(),
      in_remark: remark || null,
      in_amount: amount || 0,
      in_ulbid: ulbid,
      in_source: source || "WEB",
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
      out_RecNo: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 300 },
    };

    // ✅ Execute stored procedure
    const result = await connection.execute(
      `
      BEGIN
        aosp_rec_ins(
          :in_UserId,
          :in_request_id,
          :in_tankid,
          :in_billid,
          :in_prabhagid,
          :in_zoneid,
          :in_refno,
          :in_paymode,
          :in_bankname,
          :in_checkno,
          :in_checkdt,
          :in_recdt,
          :in_remark,
          :in_amount,
          :in_ulbid,
          :in_source,
          :out_ErrorCode,
          :out_ErrorMsg,
          :out_RecNo
        );
      END;
      `,
      binds
    );

    // ✅ Extract output parameters
    const errorCode = result.outBinds.out_ErrorCode;
    const errorMsg = result.outBinds.out_ErrorMsg;
    const recNo = result.outBinds.out_RecNo;

    res.status(200).json({
      success: errorCode === 0,
      errorCode,
      message: errorMsg,
      recNo,
    });
  } catch (err) {
    console.error("❌ Error in TankReceiptInsert:", err);
    res.status(500).json({
      success: false,
      message: "Failed to execute Tank Receipt Insert procedure.",
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection in TankReceiptInsert:", err);
      }
    }
  }
};


module.exports = { PayModeDropdown, BankNameDropdown, GetBillDetailsByBillNoBG, GetBillDetailsByBillNoRC, 
    GetTankDetailsByRequestId, GetTankReceiptByRecNo ,GetPayCodeByPayMode, TankReceiptInsert};
