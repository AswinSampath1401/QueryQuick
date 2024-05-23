import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Paper,
  InputBase,
} from "@mui/material";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import DataArrayIcon from "@mui/icons-material/DataArray";
/* import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css"; */
/* import "prismjs/themes/prism-dark.css"; */
/* import "prismjs/themes/prism-dark.min.css"; */

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-gob";

import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import Grid from "../Grid/Grid";
import getDataFromSql from "../../services/sqlservice";
import getDataFromMongoDB from "../../services/mongodbservice";
import Graphs from "../Graphs/Graphs";

const QueryEngineCell = ({
  index,
  onDelete,
  onQueryEngineChange,
  dType,
  db,
  userInput,
  userQuery,
}) => {

  const [cellDatabaseType, setCellDatabaseType] = useState(dType);
  const [cellDatabase, setCellDatabase] = useState(db);
  const [prompt, setPrompt] = useState(userInput);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState(userQuery);
  const [tab, setTab] = useState("table");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showQuery, setShowQuery] = useState(false); // State to manage showing query after lightning icon click
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleDatabaseTypeChange = (event) => {
    setCellDatabaseType(event.target.value);
    onQueryEngineChange(index, "cellDatabaseType", event.target.value);
  };

  const handleDatabaseChange = (event) => {
    const newDatabase = event.target.value;
    setCellDatabase(newDatabase);
    onQueryEngineChange(index, "cellDatabase", newDatabase);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
    onQueryEngineChange(index, "prompt", event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleGetQuery = async () => {
    let api = "";
    setLoading(true);
    setError(null);
    try {
      if (cellDatabaseType === "MySQL") {
        api = "http://localhost:5000/chat";
      } else if (cellDatabaseType === "MongoDB") {
        api = "http://localhost:5000/mongo/chat";
      }
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setQuery(data.msg);
      onQueryEngineChange(index, "query", data.msg);
      setShowQuery(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    onQueryEngineChange(index, "query", event.target.value);
  };

  const handleRunQuery = async () => {
    // /Simulate running query and fetching data
    // setTimeout(() => {
    //   setData([
    //     { id: 1, title: "A Quiet Place Part II", year: 2022, rating: 7.3 },
    //     { id: 2, title: "Black Widow", year: 2022, rating: 6.8 },
    //     { id: 3, title: "Dune", year: 2022, rating: 8.1 },
    //     { id: 4, title: "No Time to Die", year: 2022, rating: 7.4 },
    //     { id: 5, title: "The French Dispatch", year: 2022, rating: 7.5 },
    //   ]);
    //   setLoading(false);
    // }, 1000);
    try {
      setLoading(true);
      let data;
      if (cellDatabaseType === "MySQL") {
        data = await getDataFromSql({ query, cellDatabase });
      } else if (cellDatabaseType === "MongoDB") {
        data = await getDataFromMongoDB({ query, cellDatabase });
      }
      console.log(data);
      setData(data);
      // setDatabaseRecords(data); // Wrap data in an array
      // if (gridApi) {
      //   gridApi.setRowData(data); // Wrap data in an array
      // }
      // console.log(databaseRecords);
    } catch (error) {
      console.error("Error fetching data from SQL:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const commonStyles = {
    fontSize: "0.700rem",
    color: "#fff",
    "& .MuiSelect-select, & .MuiInputBase-input": {
      padding: "8px 14px",
      borderRadius: "4px",
      backgroundColor: "#383838",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#383838",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1F1E1F",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1F1E1F",
    },
  };

  const dropDownStyles = {
    marginLeft: "10px",
    "& .MuiSelect-root": {
      backgroundColor: isOpen ? "#fff" : "#f0f0f0", // Example background color change on open
      borderRadius: isOpen ? "4px 4px 0 0" : "4px", // Example border radius change on open
      width: "fit-content", // Adjust width dynamically
      minWidth: "150px", //
      fontSize: "0.700 rem",
      padding: "8px 14px",
    },
    "& .MuiListItem-root": {
      color: "#fff", // Example text color
      backgroundColor: isOpen ? "#f0f0f0" : "#fff", // Example background color change on open
      "&:hover": {
        backgroundColor: "#e0e0e0", // Example hover background color
      },
      fontSize: "0.700 rem",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        bgcolor: "#1F1E1F",
        borderRadius: "8px",
        boxShadow: 3,
        position: "relative",
        "&:hover .delete-button": {
          opacity: 1,
        },
        marginTop: "16px",
        marginBottom: "16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <Select
          value={cellDatabaseType}
          onChange={handleDatabaseTypeChange}
          displayEmpty
          open={isOpen}
          onClose={handleClose}
          onOpen={handleOpen}
          sx={{
            minWidth: "150px",
            ...commonStyles,
            ...dropDownStyles,
          }}
        >
          <MenuItem value="" disabled sx={{ fontSize: "0.700rem" }}>
            Select Database Type
          </MenuItem>
          <MenuItem value="MySQL" sx={{ fontSize: "0.700rem" }}>
            MySQL
          </MenuItem>{" "}
          <MenuItem value="PostgreSQL" sx={{ fontSize: "0.700rem" }}>
            PostgreSQL
          </MenuItem>
          {/* Add more database types as needed */}
        </Select>
        <Box sx={{ marginLeft: "10px" }}>
          <Select
            value={cellDatabase}
            onChange={handleDatabaseChange}
            displayEmpty
            sx={{
              ...commonStyles,
              ...dropDownStyles,
              minWidth: "200px",
            }}
          >
            <MenuItem value="" disabled sx={{ fontSize: "0.700rem" }}>
              Select Database Schema
            </MenuItem>
            <MenuItem value="cs220p" sx={{ fontSize: "0.700rem" }}>
              cs220p
            </MenuItem>
            <MenuItem value="db2" sx={{ fontSize: "0.700rem" }}>
              Database 2
            </MenuItem>
            {/* Add more databases as needed */}
          </Select>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          marginLeft: "10px",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Paper
          component="form"
          sx={{
            marginleft: "10px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            backgroundColor: hovered ? "#1565C0" : "#383838",
          }}
        >
          <IconButton
            sx={{
              padding: "4px 8px", // Adjust the padding to make the button smaller
              fontSize: "0.200rem",
              borderRadius: "0px", // Square corners
              transition: "background-color 0.6s", // Add transition effect
            }}
            aria-label="search"
            onClick={handleGetQuery}
          >
            {hovered ? (
              <FlashOnOutlinedIcon
                sx={{
                  color: "#fff",
                  backgroundColor: "#1565C0", // Darker shade of blue on hover
                  width: "100%",
                }}
              />
            ) : (
              <DataArrayIcon sx={{ color: "#fff" }} />
            )}
          </IconButton>
          <InputBase
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Enter prompt..."
            sx={{
              width: "100%",
              borderRadius: "4px",
              fontSize: "0.700rem",
              color: "#fff",
              "& .MuiSelect-select, & .MuiInputBase-input": {
                padding: "8px 14px",
                backgroundColor: "#1F1E1F",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#777",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#777",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#888",
              },
            }}
          />
        </Paper>
      </Box>
      {showQuery && !loading && (
        <>
          <AceEditor
            height="100px"
            width="100%"
            value={query}
            mode="sql"
            theme="gob"
            fontSize="16px"
            highlightActiveLine={true}
            onChange={(code) => setQuery(code)}
            name="UNIQUE_ID_OF_DIV"
            placeholder="Loading query..."
          />
          <Button
            variant="contained"
            onClick={handleRunQuery}
            endIcon={<PlayArrowIcon />}
            sx={{
              variant: "contained",
              color: "primary",
              padding: "4px 8px", // Adjust the padding to make the button smaller
              width: "fit-content",
              margin: "10px",
              fontSize: "0.700rem",
            }}
          >
            Run
          </Button>
        </>
      )}
      {data && (
        <>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{ marginTop: "16px", color: "#fff", marginLeft: "16px" }}
          >
            <Tab sx={{ color: '#fff' }} label="Table" value="table" />
            <Tab sx={{ color: '#fff' }} label="Charts" value="charts" />
          </Tabs>
          {tab === "table" && (
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: "4px",
                marginTop: "10px",
                color: "#fff",
                padding: "1px",
                boxShadow: 3,
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              <Grid gridData={data} />
            </Box>
          )}
          {tab === "charts" && (
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#333",
                borderRadius: "4px",
                marginTop: "10px",
                color: "#fff",
                padding: "10px",
                boxShadow: 3,
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              <Graphs graphData={data} />
            </Box>
          )}
        </>
      )}
      <IconButton
        onClick={onDelete}
        className="delete-button"
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "0.700rem",
          ...commonStyles,
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default QueryEngineCell;
