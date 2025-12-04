// import React, { useState } from "react";
// import { useFormikContext } from "formik";
// import "./FileUpload.css";

// const FileUpload = ({ disabled, name = "file", multiple = false }) => {
//   const { setFieldValue, setFieldTouched, setFieldError, values } =
//     useFormikContext();
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [fileError, setFileError] = useState("");

//   // Validate file size and type
//   // const validateFile = (file) => {
//   //   const fileSizeKB = file.size / 1024; // Convert bytes to KB
//   //   const fileExtension = file.name.split(".").pop().toUpperCase();

//   //   // // Validate file size (max 10 KB)
//   //   // if (fileSizeKB > 10) {
//   //   //   setFileError("Image size should be less than 10 KB");
//   //   //   return false;
//   //   // }

//   //   // // Validate file type (only PNG allowed)
//   //   // if (fileExtension !== "PNG") {
//   //   //   setFileError("Image should be in .PNG format only");
//   //   //   return false;
//   //   // }

//   //   return true;
//   // };

//   // Validate file type
//   const validateFile = (file) => {
//     debugger;
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//     const fileExtension = file.name.split(".").pop().toLowerCase();
//     const allowedExtensions = ["jpeg", "jpg", "png", "pdf"];

//     if (
//       !allowedTypes.includes(file.type) ||
//       !allowedExtensions.includes(fileExtension)
//     ) {
//       setFileError("फक्त JPEG, JPG किंवा PNG फाईल्स परवान्य आहेत.");
//       return false;
//     }

//     // Optional: Validate file size (e.g., < 2MB)
//     const fileSizeMB = file.size / (1024 * 1024);
//     if (fileSizeMB > 2) {
//       setFileError("फाईल साईज 2MB पेक्षा कमी असावी.");
//       return false;
//     }

//     setFileError("");
//     return true;
//   };

//   // Handle file change
//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);

//     if (files.length > 0) {
//       const validFiles = [];

//       // Validate each file before adding it
//       files.forEach((file) => {
//         if (validateFile(file)) {
//           validFiles.push(file);
//         }
//       });

//       if (validFiles.length > 0) {
//         setSelectedFiles(validFiles);
//         setFieldValue(name, multiple ? validFiles : validFiles[0]);
//         setFieldTouched(name, true);
//         setFieldError(name, ""); // Clear error if file is valid
//       }
//       event.target.value = ""; // Reset input to allow re-selection
//     }
//   };

//   // Handle file removal
//   const handleFileRemove = (index) => {
//     const updatedFiles = selectedFiles.filter((_, i) => i !== index);
//     setSelectedFiles(updatedFiles);
//     setFieldValue(
//       name,
//       updatedFiles.length ? updatedFiles : multiple ? [] : ""
//     );
//     if (updatedFiles.length === 0) setFieldError(name, "File is required"); // Show error if no file
//   };

//   return (
//     <div className="file-upload-container">
//       <div className="file-upload-box">
//         <label className="upload-button">
//           Choose {multiple ? "Files" : "File"}
//           <input
//             type="file"
//             accept=".jpeg,.jpg,.png,.pdf"
//             multiple={multiple}
//             onChange={handleFileChange}
//             className="hidden-input"
//             disabled={disabled}
//           />
//         </label>
//       </div>

//       {selectedFiles.length > 0 ? (
//         <div className="file-info-container">
//           {selectedFiles.map((file, index) => (
//             <div key={index} className="file-item">
//               <span className="file-name">{file.name}</span>
//               {/* <button type="button" onClick={() => handleFileRemove(index)} className="remove-file-button">
//                 Remove
//               </button> */}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <span className="no-file-text">No file chosen</span>
//       )}

//       {/* Show error message if validation fails */}
//       {fileError && <div className="text-danger mt-2">{fileError}</div>}
//     </div>
//   );
// };

// export default FileUpload;




import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import "./FileUpload.css";

// ADD 'onFileSelect' AND 'fileUploadKey' TO PROPS
const FileUpload = ({ 
    disabled, 
    name = "file", 
    multiple = false, 
    onFileSelect, // <--- 🔑 ADDED: Function to call on file selection
    fileUploadKey // <--- 🔑 ADDED: Key for forcing reset in parent component
}) => {
    const { setFieldValue, setFieldTouched, setFieldError } = useFormikContext();
    
    // NOTE: The state is no longer strictly necessary if you rely fully on Formik state, 
    // but we'll keep it to manage the local file display for simplicity.
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileError, setFileError] = useState("");

    // Use useEffect with the fileUploadKey to clear local state when the parent resets the component
    useEffect(() => {
        // This runs when the parent component changes the 'key' prop (e.g., after successful add)
        setSelectedFiles([]);
        setFileError("");
    }, [fileUploadKey]);


    const validateFile = (file) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]; // <--- ADDED PDF MIME TYPE
        const fileExtension = file.name.split(".").pop().toLowerCase();
        const allowedExtensions = ["jpeg", "jpg", "png", "pdf"];

        // Check if file type OR file extension is allowed
        if (
            !allowedTypes.includes(file.type) && // Check MIME type
            !allowedExtensions.includes(fileExtension) // Check extension as a fallback
        ) {
            setFileError("फक्त JPEG, JPG, PNG, किंवा PDF फाईल्स परवान्य आहेत.");
            return false;
        }

        // Optional: Validate file size (e.g., < 2MB)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 2) {
            setFileError("फाईल साईज 2MB पेक्षा कमी असावी.");
            return false;
        }

        setFileError("");
        return true;
    };

    // Handle file change
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 0) {
            const validFiles = [];

            // Validate each file before adding it
            files.forEach((file) => {
                if (validateFile(file)) {
                    validFiles.push(file);
                }
            });

            if (validFiles.length > 0) {
                setSelectedFiles(validFiles);
                
                const fileToSet = multiple ? validFiles : validFiles[0];
                
                // 🔑 CRITICAL: Call the function passed from the parent
                if (onFileSelect) {
                    onFileSelect(fileToSet);
                } else {
                    // Fallback to update Formik context directly (less flexible)
                    setFieldValue(name, fileToSet);
                }

                setFieldTouched(name, true);
                setFieldError(name, ""); // Clear error if file is valid
            } else {
                // If all selected files were invalid, ensure Formik state is cleared
                if (onFileSelect) {
                    onFileSelect(null);
                } else {
                    setFieldValue(name, multiple ? [] : null);
                }
            }
        }
        // NOTE: Removed event.target.value = "" as the 'key' prop in the parent 
        // is the recommended way to clear the input in React.
    };

    // Handle file removal
    const handleFileRemove = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        
        const filesToSet = updatedFiles.length ? updatedFiles : multiple ? [] : null;

        if (onFileSelect) {
            onFileSelect(filesToSet);
        } else {
            setFieldValue(name, filesToSet);
        }

        if (updatedFiles.length === 0) {
            setFieldError(name, "File is required"); 
        }
    };

    return (
        <div className="file-upload-container">
            <div className="file-upload-box">
                <label className="upload-button">
                    Choose {multiple ? "Files" : "File"}
                    <input
                        // The 'key' prop should be used on this component in the parent
                        // to force a reset, but we keep it clean here.
                        type="file"
                        accept=".jpeg,.jpg,.png,.pdf"
                        multiple={multiple}
                        onChange={handleFileChange}
                        className="hidden-input"
                        disabled={disabled}
                    />
                </label>
            </div>

            {selectedFiles.length > 0 ? (
                <div className="file-info-container">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                            <span className="file-name">{file.name}</span>
                            {/* Re-enabled the remove button for completeness */}
                            <button type="button" onClick={() => handleFileRemove(index)} className="remove-file-button">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="no-file-text">No file chosen</span>
            )}

            {/* Show error message if validation fails */}
            {fileError && <div className="text-danger mt-2">{fileError}</div>}
        </div>
    );
};

export default FileUpload;