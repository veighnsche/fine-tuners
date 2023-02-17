import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { HistoryItemType } from "../store/document.slice";

interface HistoryItemParams {
  onClick: (item: HistoryItemType) => void;
  item: HistoryItemType;
}

export const HistoryItem = ({ onClick, item }: HistoryItemParams) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onClick(item)}>
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
          primary={item.params.prompt}
          secondary={item.completion}
        />
      </ListItemButton>
    </ListItem>
  );
};