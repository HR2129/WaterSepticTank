import React, { useState, useEffect } from "react";
import "./Table.css";
import { useNavigate } from "react-router-dom";
import FileUpload from "../FileUpload/FileUpload";
import InputField from "../../Components/InputField/InputField";
import { Field } from "formik";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Table = ({
  headers = [],
  data = [],
  keyMapping = {},
  onCheckboxChange,
  onRadioChange,
  onDownload,
  onInputChange,
  onFileUpload,
  onSelectAllChange,
  showCheckboxInHeader = true,
  noDataMessage,
  checkboxIdentifier,
  customRenderers = {},
}) => {
  const navigate = useNavigate();
  const [base64Images, setBase64Images] = useState({});
  const BASE_URL = `${API_BASE_URL}`;
  const isAllChecked = data.length > 0 && data.every((row) => row.checked);

  useEffect(() => {
    data.forEach((row) => {
      const currentDocumentId =
        row.documentId || row.NUM_DOCUMENT_ID || row[checkboxIdentifier];
      if (currentDocumentId) {
        ["ulbImage", "ulbReportImage"].forEach((key) => {
          if (
            row[key] &&
            (!base64Images[currentDocumentId] ||
              !base64Images[currentDocumentId][key])
          ) {
            convertImageToBase64(row[key], currentDocumentId, key);
          }
        });
      }
    });
  }, [data, base64Images, checkboxIdentifier]);

  const convertImageToBase64 = async (imagePath, documentId, key) => {
    try {
      const response = await fetch(BASE_URL + imagePath);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setBase64Images((prev) => ({
          ...prev,
          [documentId]: {
            ...prev[documentId],
            [key]: base64data,
          },
        }));
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  const handleHeaderCheckboxChange = (isChecked) => {
    if (onSelectAllChange) {
      onSelectAllChange(isChecked);
    } else if (onCheckboxChange) {
      // Corrected logic for fallback: this is not how it should work
      // The parent component should handle this directly via onSelectAllChange
      // As your parent is already doing this, we can rely on that.
    }
  };

  // Handler for individual row checkboxes
  const handleRowCheckboxChange = (rowIndex) => {
    // Correctly get the row and its current checked state from the data prop
    const row = data[rowIndex];
    const newCheckedState = !row.checked;

    // Call the parent's handler with the correct parameters: rowIndex, key, and new value
    if (onCheckboxChange) {
      onCheckboxChange(rowIndex, "checked", newCheckedState);
    }
  };

  return (
    <div className="table-container">
      <table className="table table-bordered">
        <thead className="custom-thead">
          <tr>
            {headers.map((header, index) => {
              const key = keyMapping[header];
              if (key === "checked" && showCheckboxInHeader) {
                return (
                  <th key={index} className="table-header">
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={(e) =>
                        handleHeaderCheckboxChange(e.target.checked)
                      }
                    />
                  </th>
                );
              }
              return (
                <th key={index} className="table-header">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => {
              const uniqueRowId =
                row.documentId ||
                row.NUM_DOCUMENT_ID ||
                row[checkboxIdentifier] ||
                rowIndex;
              const rowChecked = row.checked || false;
              const currentDocumentId =
                row.documentId ||
                row.NUM_DOCUMENT_ID ||
                row[checkboxIdentifier];

              return (
                <tr key={uniqueRowId} className="table-row  cursor-pointer">
                  {headers.map((header, colIndex) => {
                    const key = keyMapping[header];

                    if (
                      key === "checked" ||
                      key === "approved" ||
                      key === "rejected"
                    ) {
                      return (
                        <td key={colIndex} className="table-cell">
                          <input
                            type="checkbox"
                            checked={rowChecked}
                            // Pass the rowIndex to the new handler
                            onChange={() => handleRowCheckboxChange(rowIndex)}
                          />
                        </td>
                      );
                    }
                    // ... (rest of the table cell rendering logic remains unchanged)
                    if (key === "ulbImage" || key === "ulbReportImage") {
                      const imageBase64 = currentDocumentId
                        ? base64Images[currentDocumentId]?.[key]
                        : null;
                      const imageSrc =
                        imageBase64 || (row[key] ? BASE_URL + row[key] : null);
                      return (
                        <td key={colIndex} className="table-cell">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt="ULB Image"
                              style={{
                                width: "50px",
                                height: "50px",
                                marginLeft: "20px",
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    }
                    if (key === "updateStatus") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <button
                            className="download-button"
                            onClick={() =>
                              navigate(
                                "/Pages/Marriage/FrmVaivahikStithiyadi/FrmVaivahikStithiyadi",
                                { state: { data: row } }
                              )
                            }
                          >
                            Select
                          </button>
                        </td>
                      );
                    }
                    if (key === "select") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <input
                            type="radio"
                            name="selectedRow"
                            checked={row.isSelected || false}
                            onChange={() =>
                              onRadioChange && onRadioChange(currentDocumentId)
                            }
                          />
                        </td>
                      );
                    }
                    if (key === "updateLink") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <a
                            className="update-button"
                            onClick={() => navigate(row.updateLink)}
                          >
                            {row.updateLabel || "Edit"}
                          </a>
                        </td>
                      );
                    }
                    if (
                      [
                        "viewDownload",
                        "certificateDownload",
                        "viewDocument",
                      ].includes(key)
                    ) {
                      return (
                        <td key={colIndex} className="table-cell">
                          <button
                            className="download-button"
                            onClick={() => onDownload && onDownload(row, key)}
                          >
                            {["viewDownload", "viewDocument"].includes(key)
                              ? "Download"
                              : "डाऊनलोड करा"}
                          </button>
                        </td>
                      );
                    }
                    if (key === "volume" || key === "serial") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <input
                            type="text"
                            value={row[key] || ""}
                            onChange={(e) =>
                              onInputChange &&
                              onInputChange(
                                currentDocumentId,
                                key,
                                e.target.value
                              )
                            }
                            className="table-input"
                          />
                        </td>
                      );
                    }
                    if (key === "image") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <FileUpload
                              name={`file_${currentDocumentId}`}
                              multiple={false}
                              onChange={(file) =>
                                onFileUpload(rowIndex, file, currentDocumentId)
                              }
                            />
                            {row.image && (
                              <img
                                src={row.image}
                                alt="Document Preview"
                                style={{
                                  width: "50px",
                                  height: "auto",
                                  verticalAlign: "middle",
                                }}
                              />
                            )}
                          </div>
                        </td>
                      );
                    }
                    if (key === "docDetails") {
                      return (
                        <td key={colIndex} className="table-cell">
                          <Field
                            name={`docDetails_${currentDocumentId}`}
                            component={InputField}
                            value={row[key] || ""}
                            onChange={(e) =>
                              onInputChange &&
                              onInputChange(
                                currentDocumentId,
                                key,
                                e.target.value
                              )
                            }
                            className="table-input"
                          />
                        </td>
                      );
                    }
                    if (customRenderers[header]) {
                      return (
                        <td key={colIndex} className="table-cell">
                          {customRenderers[header](row, rowIndex)}
                        </td>
                      );
                    }
                    return (
                      <td key={colIndex} className="table-cell">
                        {row[key] !== undefined && row[key] !== null
                          ? row[key]
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center text-danger"
                style={{ padding: "20px" }}
              >
                {noDataMessage || "No data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
