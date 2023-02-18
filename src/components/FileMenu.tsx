import { Divider, Menu, MenuItem, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleNameDialog } from "../store/dialogs.slice";
import { downloadJsonlEditFile, downloadJsonlFile, selectFile } from "../utils/files";

interface TopBarMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export const FileMenu = ({ anchorEl, open, onClose }: TopBarMenuProps) => {
  const getLines = useAppSelector(state => () => state.lines.lines);
  const getDocState = useAppSelector(state => () => state.document);
  const documentName = useAppSelector(state => state.document.name);
  const dispatch = useAppDispatch();

  const handleNewWindow = () => {
    window.open(window.location.href, "_blank");
    onClose();
  };

  const handleOpenFileClick = async () => {
    onClose();
    const file = await selectFile();
    // todo: MAKE IT DO SOMETHING
    console.log(file);
  };

  const handleRename = () => {
    onClose();
    dispatch(toggleNameDialog());
  };

  const handleEditSaveClick = () => {
    onClose();
    downloadJsonlEditFile({
      docState: getDocState(),
      lines: getLines(),
      name: documentName,
    });
  };

  const handleSaveClick = () => {
    onClose();
    downloadJsonlFile({ lines: getLines(), name: documentName });
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{ "& .MuiPaper-root": { width: 300 } }}
    >
      <MenuItem onClick={handleNewWindow}>New window</MenuItem>
      <Divider/>
      <MenuItem onClick={handleRename}>Rename</MenuItem>
      <Divider/>
      <Tooltip title="open .jsonl and .jsonl-edit files" placement="right">
        <MenuItem onClick={handleOpenFileClick}>Open</MenuItem>
      </Tooltip>
      <Tooltip title="for use in this program only" placement="right">
        <MenuItem onClick={handleEditSaveClick}>Save as .jsonl-edit</MenuItem>
      </Tooltip>
      <Tooltip title="for use in OpenAI" placement="right">
        <MenuItem onClick={handleSaveClick}>Save as .jsonl</MenuItem>
      </Tooltip>
    </Menu>
  );
};