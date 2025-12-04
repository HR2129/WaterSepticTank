// import React, { useState } from "react";
// import { BsChevronDown } from "react-icons/bs"; // Dropdown icon
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Password toggle icons
// import "./InputField.css";

// const InputField = ({
//   field,
//   form = {}, // Ensure form is always an object
//   label,
//   type = "text",
//   options = [],
//   placeholder = "",
//   styleClass = "",
//   readOnly = false,
//   disabled = false,
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { name, value } = field;
//   const { errors = {}, touched = {}, setFieldValue } = form; // Ensure errors & touched are objects

//   const showError = touched[name] && errors[name];

//   const handleChange = (e) => {
//     if (!readOnly && !disabled && setFieldValue) {
//       setFieldValue(name, e.target.value);
//     }
//   };

//   return (
//     <div className={`input-field-wrapper ${styleClass}`}>
//       {label && (
//         <label className={`input-label ${isFocused ? "focused" : ""}`}>
//           {label}
//         </label>
//       )}

//       <div className="input-container">
//         {type === "dropdown" ? (
//           <>
//             <select
//               {...field}
//               className="input-dropdown form-select"
//               value={value || ""}
//               onChange={handleChange}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               disabled={disabled}
//             >
//               <option value="">{placeholder || "Select an option"}</option>
//               {options.map((option, index) => (
//                 <option key={option.value || index} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <BsChevronDown className="dropdown-icon" />
//           </>
//         ) : (
//           <>
//             <input
//               {...field}
//               type={
//                 type === "password"
//                   ? showPassword
//                     ? "text"
//                     : "password"
//                   : type
//               }
//               className={`input-field form-control ${
//                 showError ? "error-border" : ""
//               }`}
//               onChange={handleChange}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               placeholder={placeholder}
//               readOnly={readOnly}
//               disabled={disabled}
//               style={
//                 disabled
//                   ? { pointerEvents: "none", backgroundColor: "#f5f5f5" }
//                   : {}
//               }
//             />
//             {type === "password" && (
//               <span
//                 className="password-toggle-icon"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             )}
//           </>
//         )}
//       </div>

//       {/ {showError && <p className="error-message">{errors[name]}</p>} /}
//     </div>
//   );
// };

// export default InputField;
import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs"; // Dropdown icon
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Password toggle icons
import "./InputField.css";

const InputField = ({
  field,
  form = {}, // Ensure form is always an object
  label,
  type = "text",
  options = [],
  placeholder = "",
  styleClass = "",
  readOnly = false,
  disabled = false,
  onChange, // Make sure this onChange is passed from Formik or from parent component
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { name } = field;
  const value = field.value || ""; // Use value safely

  const { errors = {}, touched = {}, setFieldValue } = form; // Ensure errors & touched are objects

  const showError = touched[name] && errors[name];


  const handleChange = (e) => {
  let value = e.target.value;
  let maxLength = undefined;

  // --- Handle mobile and Aadhaar limits ---
  if (type === "tel") {
    value = value.replace(/[^0-9]/g, "");
    if (name === "AAdharNo" || name === "directorAadharCard") maxLength = 12;
    else if (name === "MobileNo") maxLength = 10;
    if (maxLength) value = value.slice(0, maxLength);
  }

  // ✅ Custom restrictInput or parent-level handler
  if (typeof onChange === "function") {
    onChange(e, form); // pass form to allow setFieldValue access
    return; // stop here, the handler will update value itself
  }

  // ✅ Default fallback
  if (typeof setFieldValue === "function") {
    setFieldValue(name, value);
  }
};


  return (
    <div className={`input-field-wrapper ${styleClass}`}>
      {label && (
        <label className={`input-label ${isFocused ? "focused" : ""}`}>
          {label}
        </label>
      )}

      <div className="input-container">
        {type === "dropdown" ? (
          <>
            <select
              {...field}
              className="input-dropdown form-select"
              value={value || ""}
              onChange={handleChange} // Trigger the onChange
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
            >
              <option value="">{placeholder || "Select an option"}</option>
              {options.map((option, index) => (
                <option key={option.value || index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <BsChevronDown className="dropdown-icon" />
          </>
        ) : (
          <>
            <input
              {...field}
              value={value} // ✅ Bind Formik value properly
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
               maxLength={
                type === "tel"
                  ? name === "AAdharNo" || name === "directorAadharCard"
                    ? 12 // 12 digits for Aadhaar
                    : 10 // 10 digits for mobile number
                  : undefined
              }
              className={`input-field form-control ${
                showError ? "error-border" : ""
              }`}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              readOnly={readOnly}
              disabled={disabled}
              style={
                readOnly || disabled
                  ? { pointerEvents: "none", backgroundColor: "#f5f5f5" }
                  : {}
              }
            />

            {type === "password" && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </>
        )}
      </div>

      {/*{showError && <p className="error-message">{errors[name]}</p>} */}
    </div>
  );
};

export default InputField;
