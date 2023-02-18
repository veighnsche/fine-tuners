import { Box, useTheme } from "@mui/material";
import { useRef } from "react";
import { AuthWrapper } from "../auth/auth.wrapper";
import { LineType } from "../models/Line";
import { useAppDispatch, useAppSelector } from "../store";
import { toggleFilesDialog, toggleNameDialog } from "../store/dialogs.slice";
import { HistoryItemType } from "../store/document.slice";
import { EditText } from "./EditText";
import { FilesDialog } from "./FilesDialog";
import { History } from "./History";
import { MidBar } from "./MidBar";
import { NameDialog } from "./NameDialog";
import { Playground } from "./Playground";
import { PlaygroundSettings } from "./playground.settings";
import { TextEditorRefHandler } from "./TextEditor";
import { TopBar } from "./TopBar";
import { TrainingData } from "./TrainingData";

function App() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const barHeight = theme.spacing(6);
  const contentHeight = `calc(100vh - ${barHeight})`;
  const widthUnit = (units: number) => `calc(20vw * ${units})`;

  const editTextRef = useRef<TextEditorRefHandler>(null);

  const isNameDialogOpen = useAppSelector(state => state.dialogs.isNameDialogOpen);
  const isFilesDialogOpen = useAppSelector(state => state.dialogs.isFilesDialogOpen);

  const handleHistoryItemClick = (item: HistoryItemType) => {
    editTextRef.current?.setText({
      prompt: item.params.prompt || "",
      completion: item.completion,
      id: item.id,
      from: "history",
    });
  };

  const handleLineClick = (line: LineType) => {
    editTextRef.current?.setText({
      prompt: line.prompt,
      completion: line.completion,
      from: "training",
    });
  };

  return (
    <AuthWrapper>
      <>
        <Box>
          <TopBar height={barHeight}/>
          <Box height={contentHeight} display="flex">
            <Playground width={widthUnit(4)}/>
            <PlaygroundSettings width={widthUnit(1)} minWidth={theme.spacing(40)}/>
          </Box>
          <MidBar height={barHeight}/>
          <Box height={contentHeight} display="flex" gap={1} p={1}>
            <History
              width={widthUnit(0.75)}
              minWidth={theme.spacing(30)}
              onHistoryItemClick={handleHistoryItemClick}
            />
            <TrainingData
              width={widthUnit(0.75)}
              minWidth={theme.spacing(30)}
              onLineClick={handleLineClick}
            />
            <EditText
              ref={editTextRef}
              width={widthUnit(3.5)}
            />
          </Box>
        </Box>
        {isNameDialogOpen ? (
          <NameDialog open={isNameDialogOpen} onClose={() => dispatch(toggleNameDialog())}/>
        ) : null}
        {isFilesDialogOpen ? (
          <FilesDialog open={isFilesDialogOpen} onClose={() => dispatch(toggleFilesDialog())}/>
        ) : null}
      </>
    </AuthWrapper>
  );
}

export default App;
