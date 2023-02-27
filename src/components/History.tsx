import HistoryIcon from "@mui/icons-material/History";
import { Box, Divider, List, Paper, Theme, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppSelector } from "../store";
import { HistoryItemType } from "../store/document.slice";
import { HistoryItem } from "./HistoryItem";

interface HistoryProps {
  width: ReturnType<Theme["spacing"]>;
  minWidth: ReturnType<Theme["spacing"]>;
  onHistoryItemClick: (item: HistoryItemType) => void;
}

export const History = ({ width, minWidth, onHistoryItemClick }: HistoryProps) => {
  const historyItems = useAppSelector(state => state.document.history);
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
        <HistoryIcon fontSize="small"/>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
        >
          History
        </Typography>
      </Box>
      {historyItems.length === 0 ? (
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
            No history items
          </Typography>
        </Box>
      ) : (
        <List
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          {historyItems.map((item, index) => (
            <Fragment key={index}>
              {index !== 0 ? <Divider/> : null}
              <HistoryItem
                item={item}
                onClick={onHistoryItemClick}
              />
            </Fragment>
          ))}
        </List>
      )}

    </Paper>
  );
};