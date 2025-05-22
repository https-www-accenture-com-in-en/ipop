import React, { useState, useEffect, useRef } from "react";
import { CgAdd } from "react-icons/cg";
import { GrEdit } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowDropdown } from "react-icons/io";
import { TextField } from "@mui/material";
const ComboBox = ({
  allNames,
  setAllNames,
  setUiType,
  setSelectedName,
  setSequence,
  label,
  disabled = false,
}) => {
  const [value, setValue] = useState("");
  const [editingName, setEditingName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onInputChange = (e) => {
    setValue(e.target.value);
    setIsOpen(true);
  };

  const onCommit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      resetInput();
      return;
    }

    if (editingName) {
      const updated = allNames.map((name) =>
        name === editingName ? trimmed : name
      );
      setAllNames(updated);
    } else if (!allNames.includes(trimmed)) {
      setAllNames([...allNames, trimmed]);
    }

    resetInput();
  };

  const onDelete = (nameToDelete) => {
    const target = nameToDelete || editingName || value.trim();
    if (!target) return;

    const updated = allNames.filter((name) => name !== target);
    setAllNames(updated);
    resetInput();
  };

  const onSelect = (name, index) => {
    setValue(name);
    setEditingName(null);
    setIsOpen(false);
    setSelectedName(name);
    setSequence(index);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCommit();
    }
  };

  const resetInput = () => {
    setValue("");
    setEditingName(null);
    setIsOpen(false);
  };

  const isExisting = allNames.includes(value.trim());
  const showSave =
    value.trim().length > 0 && (editingName !== null || !isExisting);
  const showDeleteInput = editingName !== null;
  const showToggle = !showSave && !showDeleteInput;

  return (
    <div ref={wrapperRef} style={{ position: "relative", minWidth: "300px" }}>
      <label
        htmlFor="nameInput"
        style={{ display: "block", marginBottom: 15, fontWeight: "bold" }}
      >
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <TextField
          id="nameInput"
          style={{
            width: "100%",
            borderRadius: "4px",
          }}
          value={value}
          size="small"
          onChange={onInputChange}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="Type or select"
          disabled={disabled}
        />

        {/* Save button */}
        {showSave && (
          <button
            onClick={onCommit}
            aria-label="Save"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2em",
              color: "#7500c0",
            }}
          >
            <CgAdd />
          </button>
        )}

        {/* Delete button */}
        {showDeleteInput && (
          <button
            onClick={() => onDelete()}
            aria-label="Delete"
            style={{
              position: "absolute",
              right: showSave ? 40 : 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2em",
              color: "#7500c0",
            }}
          >
            <MdDeleteOutline />
          </button>
        )}

        {/* Toggle dropdown */}
        {!disabled && showToggle && (
          <button
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2em",
              color: "#7500c0",
            }}
          >
            <IoIosArrowDropdown />
          </button>
        )}
      </div>

      {/* Dropdown list */}
      {!disabled && isOpen && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            maxHeight: 200,
            overflowY: "auto",
            position: "absolute",
            width: "100%",
            background: "#fff",
            zIndex: 10,
            color: "black",
          }}
        >
          {allNames.map((name, index) => (
            <li
              key={name}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                cursor: "pointer",
              }}
              onClick={() => onSelect(name, index + 1)}
            >
              <span>{`${index + 1}. ${name}`}</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Edit */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue(name);
                    setEditingName(name);
                    setIsOpen(false);
                    setSelectedName(null);
                    setSequence(null);
                  }}
                  aria-label="Edit"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1em",
                    marginLeft: 4,
                    color: "#7500c0",
                  }}
                >
                  <GrEdit />
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(name);
                  }}
                  aria-label="Delete"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1em",
                    marginLeft: 2,
                    color: "#7500c0",
                  }}
                >
                  <MdDeleteOutline />
                </button>

                {/* Move Up */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index > 0) {
                      const updated = [...allNames];
                      [updated[index - 1], updated[index]] = [
                        updated[index],
                        updated[index - 1],
                      ];
                      setAllNames(updated);
                    }
                  }}
                  disabled={index === 0}
                  style={{ marginLeft: 2 }}
                >
                  ↑
                </button>

                {/* Move Down */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index < allNames.length - 1) {
                      const updated = [...allNames];
                      [updated[index + 1], updated[index]] = [
                        updated[index],
                        updated[index + 1],
                      ];
                      setAllNames(updated);
                    }
                  }}
                  disabled={index === allNames.length - 1}
                  style={{ marginLeft: 4 }}
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;
