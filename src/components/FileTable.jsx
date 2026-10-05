import React from "react";
import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import MovieIcon from "@mui/icons-material/Movie";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const FileTable = ({ files = [] }) => {

  const getIcon = (name) => {

    if (!name) return <InsertDriveFileIcon />;

    const file = name.toLowerCase();

    if (file.endsWith(".pdf"))
      return <PictureAsPdfIcon color="error" />;

    if (file.endsWith(".docx"))
      return <DescriptionIcon color="primary" />;

    if (
      file.endsWith(".xls") ||
      file.endsWith(".xlsx")
    )
      return <TableChartIcon color="success" />;

    if (
      file.endsWith(".mp3") ||
      file.endsWith(".wav") ||
      file.endsWith(".aac") ||
      file.endsWith(".m4a")
    )
      return <AudioFileIcon color="secondary" />;

    if (
      file.endsWith(".mp4") ||
      file.endsWith(".avi") ||
      file.endsWith(".mov") ||
      file.endsWith(".mkv")
    )
      return <MovieIcon color="warning" />;

    return <InsertDriveFileIcon />;
  };

  const getStatusColor = (status) => {

    switch (status) {

      case "COMPLETED":
        return "success";

      case "PROCESSING":
        return "warning";

      case "FAILED":
        return "error";

      default:
        return "primary";
    }

  };

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "#1976d2",
          color: "#fff",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Uploaded Files
        </Typography>

        <Typography variant="body2">
          AI Knowledge Base
        </Typography>
      </Box>

      <TableContainer>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                <b>File</b>
              </TableCell>

              <TableCell>
                <b>Type</b>
              </TableCell>

              <TableCell>
                <b>Size</b>
              </TableCell>

              <TableCell>
                <b>Status</b>
              </TableCell>

              <TableCell width={180}>
                <b>Progress</b>
              </TableCell>

              <TableCell>
                <b>Pages</b>
              </TableCell>

              <TableCell>
                <b>Chunks</b>
              </TableCell>

              <TableCell>
                <b>Current Step</b>
              </TableCell>

              <TableCell>
                <b>Time</b>
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {files.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={9}
                  align="center"
                >
                  <Typography
                    color="text.secondary"
                    py={3}
                  >
                    No files uploaded.
                  </Typography>
                </TableCell>

              </TableRow>

            ) : (

              files.map((file, index) => (

                <TableRow
                  hover
                  key={index}
                >

                  <TableCell>

                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >

                      {getIcon(file.fileName)}

                      <Typography
                        fontWeight={600}
                      >
                        {file.fileName}
                      </Typography>

                    </Box>

                  </TableCell>

                  <TableCell>
                    {file.fileType}
                  </TableCell>

                  <TableCell>
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </TableCell>

                  <TableCell>

                    <Chip
                      label={file.status}
                      color={getStatusColor(file.status)}
                    />

                  </TableCell>

                  <TableCell>

                    <LinearProgress
                      variant="determinate"
                      value={file.progress || 0}
                    />

                    <Typography
                      variant="caption"
                    >
                      {file.progress || 0}%
                    </Typography>

                  </TableCell>

                  <TableCell>
                    {file.totalPages}
                  </TableCell>

                  <TableCell>
                    {file.totalChunks}
                  </TableCell>

                  <TableCell>
                    {file.currentStep}
                  </TableCell>

                  <TableCell>
                    {file.processingTime} ms
                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </Paper>
  );

};

export default FileTable;