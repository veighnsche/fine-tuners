import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LineType } from "../models/Line";

interface HistoryItemParams {
  onClick: (item: LineType) => void;
  line: LineType;
}

export const TrainingDataItem = ({ onClick, line }: HistoryItemParams) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onClick(line)}>
        <ListItemText
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            "& .MuiListItemText-primary": {
              textOverflow: "ellipsis",
            },
            "& .MuiListItemText-secondary": {
              textOverflow: "ellipsis",
            },
          }}
          primary={line.prompt}
          secondary={line.completion}
        />
      </ListItemButton>
    </ListItem>
  );
};