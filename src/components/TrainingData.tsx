import DataObjectIcon from "@mui/icons-material/DataObject";
import { Box, Divider, List, Paper, Theme, Typography } from "@mui/material";
import { Fragment } from "react";
import { LineType } from "../models/Line";
import { useAppSelector } from "../store";
import { TrainingDataItem } from "./TrainingDataItem";

interface HistoryProps {
  width: ReturnType<Theme["spacing"]>;
  minWidth: ReturnType<Theme["spacing"]>;
  onLineClick: (line: LineType) => void;
}

export const TrainingData = ({ width, minWidth, onLineClick }: HistoryProps) => {
  const lines = useAppSelector(state => state.lines.lines);

  return (
    <Paper sx={{
      p: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      gap: 1,
      width,
      minWidth,
    }}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
      >
        <DataObjectIcon fontSize="small"/>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          Training Data
        </Typography>
      </Box>
      {lines.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            flexGrow: 1,
            opacity: 0.5,
          }}
        >
          <Typography
            variant="body2"
            component="div"
          >
            No training data
          </Typography>
        </Box>
      ) : (
        <List>
          {lines.map((line, index) => (
            <Fragment key={index}>
              {index !== 0 ? <Divider/> : null}
              <TrainingDataItem
                line={line}
                onClick={onLineClick}
              />
            </Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};