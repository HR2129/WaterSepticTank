// import * as Yup from "yup";

// /**
//  * Global Validation Schemas for all forms.
//  * @param {function} translate - translation function
//  */
// export const ValidationSchemas = (translate) => {
//   // Common reusable rules
//   const common = {
//     requiredString: Yup.string().required(translate("This field is required")),

//     selectedOption: Yup.string()
//       .required(translate("Please select an option"))
//       .test("is-not-empty", translate("Please select an option"), (value) => value !== ""),

//     positiveNumber: Yup.number()
//       .typeError(translate("Must be a number"))
//       .min(0, translate("Value cannot be negative"))
//       .required(translate("This field is required")),

//     // 🔥 Correct Mobile Number Validation (10 digits only)
//     mobileNumber: Yup.string()
//       .matches(
//     /^[6-9][0-9]{9}$/,
//     translate("Mobile number must start with 6, 7, 8, or 9 and be 10 digits")
//   )
//   .required(translate("Mobile Number is required")),

//     // 🔥 Correct Name Validation (only alphabets + spaces)
//     nameOnly: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, translate("Only alphabets allowed"))
//       .required(translate("This field is required")),
//   };

//   return {
//     // ========================== FrmBillGen / FrmRecieptGen ==========================
//     FrmBillGen: (loaded = false) =>
//       Yup.object({
//         tankNo: Yup.string().required(translate("Tank Number is required to search")),
//         prabhag: loaded ? common.selectedOption : Yup.string().nullable(),
//         zone: loaded ? common.selectedOption : Yup.string().nullable(),
//         billGenerationDate: loaded
//           ? Yup.string().required(translate("Bill Generation Date is required"))
//           : Yup.string().nullable(),

//         distanceManual: loaded ? common.positiveNumber : Yup.number().nullable(),
//         wasteQuantity: loaded ? common.positiveNumber : Yup.number().nullable(),
//         distanceCharges: loaded ? common.positiveNumber : Yup.number().nullable(),
//         wasteCharges: loaded ? common.positiveNumber : Yup.number().nullable(),
//         totalCharges: loaded ? common.positiveNumber : Yup.number().nullable(),
//       }),

//     FrmRecieptGen: (loaded = false) =>
//       Yup.object({
//         billNo: Yup.string().required(translate("Bill Number is required to search")),

//         ownerName: loaded ? common.nameOnly : Yup.string().nullable(),

//         mobileNumber: loaded ? common.mobileNumber : Yup.string().nullable(),

//         address: loaded ? common.requiredString : Yup.string().nullable(),

//         billAmount: loaded
//           ? Yup.number()
//               .typeError(translate("Bill Amount must be a number"))
//               .required(translate("Bill Amount is required"))
//               .min(0, translate("Amount must be non-negative"))
//           : Yup.number().nullable(),

//         prabhag: loaded ? common.selectedOption : Yup.string().nullable(),
//         zone: loaded ? common.selectedOption : Yup.string().nullable(),
//         paymentMode: loaded ? common.selectedOption : Yup.string().nullable(),

//         paidAmount: loaded
//           ? Yup.number()
//               .typeError(translate("Paid Amount must be a number"))
//               .required(translate("Paid Amount is required"))
//           : Yup.number().nullable(),

//         bankName: loaded
//           ? Yup.string().when("paymentMode", {
//               is: (val) => val !== "1",
//               then: common.requiredString,
//               otherwise: Yup.string().nullable(),
//             })
//           : Yup.string().nullable(),

//         receiptDate: loaded
//           ? Yup.date().required(translate("Receipt Date is required"))
//           : Yup.date().nullable(),

//         checkNo: loaded
//           ? Yup.string().when("paymentMode", {
//               is: (val) => val !== "1",
//               then: common.requiredString,
//               otherwise: Yup.string().nullable(),
//             })
//           : Yup.string().nullable(),

//         checkDate: loaded
//           ? Yup.date().when("paymentMode", {
//               is: (val) => val !== "1",
//               then: Yup.date().required(translate("Check Date is required")),
//               otherwise: Yup.date().nullable(),
//             })
//           : Yup.date().nullable(),

//         referenceNo: Yup.string().nullable(),
//         remark: Yup.string().nullable(),
//       }),

//     // ========================== FrmTradeMst ==========================
//     FrmTradeMst: Yup.object().shape({
//       in_PageTitle: common.selectedOption,
//       in_status: common.selectedOption,
//       mainmenu: common.selectedOption,
//     }),

//     // ========================== FrmAssetTypeMst ==========================
//     FrmAssetTypeMst: Yup.object().shape({
//       assetCategory: Yup.string()
//         .trim()
//         .required(translate("Please enter Asset Category"))
//         .min(2, translate("Asset Category must be at least 2 characters")),
//     }),

//     // ========================== FrmAssetSubTypeMst ==========================
//     FrmAssetSubTypeMst: Yup.object().shape({
//       assetCategory: common.selectedOption,
//       assetSubCategory: Yup.string()
//         .trim()
//         .required(translate("Please enter Asset Sub Category name"))
//         .min(2, translate("Asset Sub Category must be at least 2 characters"))
//         .max(100, translate("Asset Sub Category must be less than 100 characters")),
//       unitOfMeasurement: common.selectedOption,
//     }),

//     // ========================== FrmAssetUnitMst ==========================
//     FrmAssetUnitMst: Yup.object().shape({
//       unitName: Yup.string()
//         .trim()
//         .required(translate("Please enter Unit Name"))
//         .min(1, translate("Unit Name must be at least 1 character"))
//         .max(50, translate("Unit Name must be less than 50 characters")),
//     }),

//     // ========================== FrmDocumentMst ==========================
//     FrmDocumentMst: Yup.object().shape({
//       documentName: Yup.string()
//         .trim()
//         .required(translate("Please enter Document Name"))
//         .min(2, translate("Document Name must be at least 2 characters"))
//         .max(100, translate("Document Name must be less than 100 characters")),
//     }),

//     // ========================== FrmRateOfDepreciationMst ==========================
//     FrmRateOfDepreciationMst: Yup.object().shape({
//       assetCatId: common.selectedOption,
//       assetSubCatId: common.selectedOption,
//       unitMeasurement: Yup.number()
//         .typeError(translate("Please enter a valid number"))
//         .required(translate("Please enter Depreciation Rate"))
//         .min(0, translate("Depreciation Rate cannot be negative"))
//         .max(100, translate("Depreciation Rate cannot exceed 100")),
//     }),
//   };
// };

// /* =====================================================
//     ASSIGN INSPECTION VALIDATION
// ===================================================== */
// export const getAssignInspectionValidation = (mode, translate) => {
//   const base = {
//     assignedTo: Yup.string().required(translate("Required")),
//     visitDate: Yup.string().required(translate("Required")),
//   };

//   if (mode === "2") {
//     return Yup.object({
//       ...base,
//       tankCondition: Yup.string().required(translate("Required")),
//       accessDifficulty: Yup.string().required(translate("Required")),
//       wasteLevel: Yup.string().required(translate("Required")),
//       inspectionRemarks: Yup.string().required(translate("Required")),
//       statusRadio: Yup.string().required(translate("Required")),
//     });
//   }

//   return Yup.object(base);
// };

// /* =====================================================
//     CLEANING EXECUTION VALIDATION
// ===================================================== */
// export const getCleaningExecutionValidation = (translate) => {
//   return Yup.object({
//     clngDate: Yup.string().required(translate("Required")),
//     startTime: Yup.string().required(translate("Required")),
//     endTime: Yup.string().required(translate("Required")),
//     wasteCollected: Yup.string()
//       .required(translate("Required"))
//       .matches(/^[0-9]+$/, translate("Only numbers allowed")),
//     wasteTypeId: Yup.string().required(translate("Required")),
//     clngRemark: Yup.string()
//       .required(translate("Required"))
//       .matches(/^[A-Za-z0-9()\-\s]+$/, translate("Only text, numbers, () - and spaces allowed")),
//     clngStatus: Yup.string().required(translate("Required")),
//   });
// };

// /* =====================================================
//     CONTRACTOR VALIDATION
// ===================================================== */
// export const getContractorValidation = (translate) => {
//   return Yup.object({
//     contractorName: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, translate("Only alphabets allowed"))
//       .required(translate("Please Enter Name")),

//     mobileNumber: Yup.string()
//       .matches(/^[0-9]{10}$/, translate("Mobile number must be exactly 10 digits"))
//       .required(translate("Please Enter Mobile number")),

//     address: Yup.string()
//       .required(translate("Please Enter Address"))
//       .matches(/^[A-Za-z0-9()\-\s]+$/, translate("Only alphabets, numbers, (), -, and spaces allowed"))
//       .min(5, translate("Address is too short")),
//   });
// };

// /* =====================================================
//     STAFF VALIDATION
// ===================================================== */
// export const getStaffValidation = (translate) => {
//   return Yup.object({
//     staffName: Yup.string()
//       .matches(/^[A-Za-z\s]+$/, translate("Only alphabets allowed"))
//       .required(translate("Please Enter Name")),

//     mobileNumber: Yup.string()
//       .matches(/^[0-9]{10}$/, translate("Mobile number must be 10 digits"))
//       .required(translate("Please Enter Mobile number")),

//     address: Yup.string()
//       .required(translate("Please Enter Address"))
//       .matches(/^[A-Za-z0-9()\-\s]+$/, translate("Only alphabets, numbers, (), -, and spaces allowed"))
//       .min(5, translate("Address is too short")),
//   });
// };

// /* =====================================================
//  ⭐ RATE CONFIGURATION VALIDATION
// ===================================================== */
// export const getRateConfigValidation = (translate) => {
//   return Yup.object({
//     ulbId: Yup.string().required(translate("ULB Name is required")),
//     rateType: Yup.string().required(translate("Rate Type is required")),

//     from: Yup.number()
//       .typeError(translate("Enter a valid number"))
//       .required(translate("From value is required"))
//       .min(0, translate("Invalid value")),

//     to: Yup.number()
//       .typeError(translate("Enter a valid number"))
//       .required(translate("To value is required"))
//       .min(0, translate("Invalid value")),

//     amount: Yup.number()
//       .typeError(translate("Enter a valid amount"))
//       .required(translate("Amount is required"))
//       .min(0.1, translate("Amount must be greater than zero")),

//     in_status: Yup.string().required(translate("Status is required")),
//   });
// };

import * as Yup from "yup";

/**
 * Global Validation Schemas for all forms.
 * @param {function} translate - translation function
 */
export const ValidationSchemas = (translate) => {
  // Common reusable rules
  const common = {
    requiredString: Yup.string().required(translate("This field is required")),

    selectedOption: Yup.string()
      .required(translate("Please select an option"))
      .test("is-not-empty", translate("Please select an option"), (value) => value !== ""),

    positiveNumber: Yup.number()
      .typeError(translate("Must be a number"))
      .min(0, translate("Value cannot be negative"))
      .required(translate("This field is required")),

    // ⭐ Correct Mobile Number Validation: must start with 6/7/8/9 ONLY
    mobileNumber: Yup.string()
      .matches(
        /^[6-9][0-9]{9}$/,
        translate("Mobile number must start with 6, 7, 8, or 9 and be 10 digits")
      )
      .required(translate("Mobile Number is required")),

    // Correct Name Validation (only alphabets + spaces)
    nameOnly: Yup.string()
      .matches(/^[A-Za-z\s]+$/, translate("Only alphabets allowed"))
      .required(translate("This field is required")),
  };

  return {
    // ========================== FrmBillGen / FrmRecieptGen ==========================
    FrmBillGen: (loaded = false) =>
      Yup.object({
        tankNo: Yup.string().required(translate("Tank Number is required to search")),
        prabhag: loaded ? common.selectedOption : Yup.string().nullable(),
        zone: loaded ? common.selectedOption : Yup.string().nullable(),
        billGenerationDate: loaded
          ? Yup.string().required(translate("Bill Generation Date is required"))
          : Yup.string().nullable(),

        distanceManual: loaded ? common.positiveNumber : Yup.number().nullable(),
        wasteQuantity: loaded ? common.positiveNumber : Yup.number().nullable(),
        distanceCharges: loaded ? common.positiveNumber : Yup.number().nullable(),
        wasteCharges: loaded ? common.positiveNumber : Yup.number().nullable(),
        totalCharges: loaded ? common.positiveNumber : Yup.number().nullable(),
      }),

    FrmRecieptGen: (loaded = false) =>
      Yup.object({
        billNo: Yup.string().required(translate("Bill Number is required to search")),

        ownerName: loaded ? common.nameOnly : Yup.string().nullable(),

        // ⭐ Mobile starts with 6-9 only
        mobileNumber: loaded ? common.mobileNumber : Yup.string().nullable(),

        address: loaded ? common.requiredString : Yup.string().nullable(),

        billAmount: loaded
          ? Yup.number()
              .typeError(translate("Bill Amount must be a number"))
              .required(translate("Bill Amount is required"))
              .min(0, translate("Amount must be non-negative"))
          : Yup.number().nullable(),

        prabhag: loaded ? common.selectedOption : Yup.string().nullable(),
        zone: loaded ? common.selectedOption : Yup.string().nullable(),
        paymentMode: loaded ? common.selectedOption : Yup.string().nullable(),

        paidAmount: loaded
          ? Yup.number()
              .typeError(translate("Paid Amount must be a number"))
              .required(translate("Paid Amount is required"))
          : Yup.number().nullable(),

        bankName: loaded
          ? Yup.string().when("paymentMode", {
              is: (val) => val !== "1",
              then: common.requiredString,
              otherwise: Yup.string().nullable(),
            })
          : Yup.string().nullable(),

        receiptDate: loaded
          ? Yup.date().required(translate("Receipt Date is required"))
          : Yup.date().nullable(),

        checkNo: loaded
          ? Yup.string().when("paymentMode", {
              is: (val) => val !== "1",
              then: common.requiredString,
              otherwise: Yup.string().nullable(),
            })
          : Yup.string().nullable(),

        checkDate: loaded
          ? Yup.date().when("paymentMode", {
              is: (val) => val !== "1",
              then: Yup.date().required(translate("Check Date is required")),
              otherwise: Yup.date().nullable(),
            })
          : Yup.date().nullable(),

        referenceNo: Yup.string().nullable(),
        remark: Yup.string().nullable(),
      }),

    // ========================== FrmTradeMst ==========================
    FrmTradeMst: Yup.object().shape({
      in_PageTitle: common.selectedOption,
      in_status: common.selectedOption,
      mainmenu: common.selectedOption,
    }),

    // ========================== FrmAssetTypeMst ==========================
    FrmAssetTypeMst: Yup.object().shape({
      assetCategory: Yup.string()
        .trim()
        .required(translate("Please enter Asset Category"))
        .min(2, translate("Asset Category must be at least 2 characters")),
    }),

    // ========================== FrmAssetSubTypeMst ==========================
    FrmAssetSubTypeMst: Yup.object().shape({
      assetCategory: common.selectedOption,
      assetSubCategory: Yup.string()
        .trim()
        .required(translate("Please enter Asset Sub Category name"))
        .min(2, translate("Asset Sub Category must be at least 2 characters"))
        .max(100, translate("Asset Sub Category must be less than 100 characters")),
      unitOfMeasurement: common.selectedOption,
    }),

    // ========================== FrmAssetUnitMst ==========================
    FrmAssetUnitMst: Yup.object().shape({
      unitName: Yup.string()
        .trim()
        .required(translate("Please enter Unit Name"))
        .min(1, translate("Unit Name must be at least 1 character"))
        .max(50, translate("Unit Name must be less than 50 characters")),
    }),

    // ========================== FrmDocumentMst ==========================
    FrmDocumentMst: Yup.object().shape({
      documentName: Yup.string()
        .trim()
        .required(translate("Please enter Document Name"))
        .min(2, translate("Document Name must be at least 2 characters"))
        .max(100, translate("Document Name must be less than 100 characters")),
    }),

    // ========================== FrmRateOfDepreciationMst ==========================
    FrmRateOfDepreciationMst: Yup.object().shape({
      assetCatId: common.selectedOption,
      assetSubCatId: common.selectedOption,
      unitMeasurement: Yup.number()
        .typeError(translate("Please enter a valid number"))
        .required(translate("Please enter Depreciation Rate"))
        .min(0, translate("Depreciation Rate cannot be negative"))
        .max(100, translate("Depreciation Rate cannot exceed 100")),
    }),
  };
};

/* =====================================================
    ASSIGN INSPECTION VALIDATION
===================================================== */
export const getAssignInspectionValidation = (mode, translate) => {
  const base = {
    assignedTo: Yup.string().required(translate("Required")),
    visitDate: Yup.string().required(translate("Required")),
  };

  if (mode === "2") {
    return Yup.object({
      ...base,
      tankCondition: Yup.string().required(translate("Required")),
      accessDifficulty: Yup.string().required(translate("Required")),
      wasteLevel: Yup.string().required(translate("Required")),
      inspectionRemarks: Yup.string().required(translate("Required")),
      statusRadio: Yup.string().required(translate("Required")),
    });
  }

  return Yup.object(base);
};

/* =====================================================
    CLEANING EXECUTION VALIDATION
===================================================== */
export const getCleaningExecutionValidation = (translate) => {
  return Yup.object({
    clngDate: Yup.string().required(translate("Required")),
    startTime: Yup.string().required(translate("Required")),
    endTime: Yup.string().required(translate("Required")),
    wasteCollected: Yup.string()
      .required(translate("Required"))
      .matches(/^[0-9]+$/, translate("Only numbers allowed")),
    wasteTypeId: Yup.string().required(translate("Required")),
    clngRemark: Yup.string()
      .required(translate("Required"))
      .matches(/^[A-Za-z0-9()\-\s]+$/, translate("Only text, numbers, () - and spaces allowed")),
    clngStatus: Yup.string().required(translate("Required")),
  });
};

/* =====================================================
    CONTRACTOR VALIDATION
===================================================== */
export const getContractorValidation = (translate) => {
  return Yup.object({
    contractorName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, translate("Only alphabets allowed"))
      .required(translate("Please Enter Name")),

    // ⭐ Mobile starts only with 6/7/8/9
    mobileNumber: Yup.string()
      .matches(
        /^[6-9][0-9]{9}$/,
        translate("Mobile number must start with 6, 7, 8, or 9 and be 10 digits")
      )
      .required(translate("Please Enter Mobile number")),

    address: Yup.string()
      .required(translate("Please Enter Address"))
      .matches(/^[A-Za-z0-9()\-\s]+$/, translate("Only alphabets, numbers, (), -, and spaces allowed"))
      .min(5, translate("Address is too short")),
  });
};

/* =====================================================
    STAFF VALIDATION
===================================================== */
export const getStaffValidation = (translate) => {
  return Yup.object({
    staffName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, translate("Only alphabets allowed"))
      .required(translate("Please Enter Name")),

    // ⭐ Mobile starts only with 6/7/8/9
    mobileNumber: Yup.string()
      .matches(
        /^[6-9][0-9]{9}$/,
        translate("Mobile number must start with 6, 7, 8, or 9 and be 10 digits")
      )
      .required(translate("Please Enter Mobile number")),

    address: Yup.string()
      .required(translate("Please Enter Address"))
      .matches(/^[A-Za-z0-9()\-\s]+$/, translate("Only alphabets, numbers, (), -, and spaces allowed"))
      .min(5, translate("Address is too short")),
  });
};

/* =====================================================
 ⭐ RATE CONFIGURATION VALIDATION
===================================================== */
export const getRateConfigValidation = (translate) => {
  return Yup.object({
    ulbId: Yup.string().required(translate("ULB Name is required")),
    rateType: Yup.string().required(translate("Rate Type is required")),

    from: Yup.number()
      .typeError(translate("Enter a valid number"))
      .required(translate("From value is required"))
      .min(0, translate("Invalid value")),

    to: Yup.number()
      .typeError(translate("Enter a valid number"))
      .required(translate("To value is required"))
      .min(0, translate("Invalid value")),

    amount: Yup.number()
      .typeError(translate("Enter a valid amount"))
      .required(translate("Amount is required"))
      .min(0.1, translate("Amount must be greater than zero")),

    in_status: Yup.string().required(translate("Status is required")),
  });
};

