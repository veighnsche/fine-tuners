import { Divider, Menu, MenuItem } from "@mui/material";
import { useOpenAI } from "../openAI";
import { useAppDispatch } from "../store";
import { toggleFilesDialog } from "../store/dialogs.slice";
import { setFiles } from "../store/files.slice";
import { useAddNotification } from "../store/notifications.slice";

interface OpenAiMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}


export const OpenAiMenu = ({ open, anchorEl, onClose }: OpenAiMenuProps) => {
  const { uploadCurrentLines, fetchFiles } = useOpenAI();
  const dispatch = useAppDispatch();
  const addNotification = useAddNotification()

  const handleUpload = () => {
    onClose();
    uploadCurrentLines().then(() => {
      addNotification({ message: "Uploaded to OpenAI", severity: "success" });
    });
  };

  const handleTrain = () => {

  };

  const handleTrainUploaded = () => {

  };

  const handleViewFiles = async () => {
    onClose();
    dispatch(toggleFilesDialog());
    const files = await fetchFiles();
    dispatch(setFiles({ files }));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      sx={{ "& .MuiPaper-root": { width: 300 } }}
    >
      <MenuItem onClick={handleUpload}>Upload</MenuItem>
      <MenuItem onClick={handleTrain}>Train</MenuItem>
      <MenuItem onClick={handleTrainUploaded}>Upload & Train</MenuItem>
      <Divider/>
      <MenuItem onClick={handleViewFiles}>View uploaded files</MenuItem>
    </Menu>
  );
};