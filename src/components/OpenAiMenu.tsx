import { Divider, Menu, MenuItem } from "@mui/material";
import { useOpenAI } from "../openAI";

interface OpenAiMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}


export const OpenAiMenu = ({ open, anchorEl, onClose }: OpenAiMenuProps) => {
  // upload training data file to openAI
  // upload and train the training data file
  // train an uploaded training data file

  const { uploadCurrentLines } = useOpenAI();

  const handleUpload = () => {
    uploadCurrentLines().then(() => {
      onClose();
    });
  };

  const handleTrain = () => {

  };

  const handleTrainUploaded = () => {

  };

  const handleEditSaveClick = () => {

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
      <Divider/>
      <MenuItem onClick={handleTrainUploaded}>Upload & Train</MenuItem>
      <Divider/>
      <MenuItem onClick={handleEditSaveClick}>Download</MenuItem>
    </Menu>
  );
};