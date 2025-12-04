const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

const callPropertyOtpProcedure = async (req, res) => {
  const { in_userid, in_Mobile, in_otp, in_mode, in_ulbid } = req.body;

  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
       admins.aoms_proplogin_otp(
          :in_userid,
          :in_Mobile,
          :in_otp,
          :in_mode,
          :in_ulbid,
          :out_ErrorCode,
          :out_ErrorMsg
        );
      END;
      `,
      {
        in_userid,
        in_Mobile,
        in_otp,
        in_mode,
        in_ulbid,
        out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        out_ErrorMsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
      }
    );

    const output = {
      success: true,
      ErrorCode: result.outBinds.out_ErrorCode,
      ErrorMsg: result.outBinds.out_ErrorMsg,
    };

    res.status(200).json(output);
  } catch (error) {
    console.error("Error executing aoms_proplogin_otp:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

module.exports = { callPropertyOtpProcedure };
