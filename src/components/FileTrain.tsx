import styled from "@emotion/styled";
import { Box, Button, ButtonGroup, Paper, Theme, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useOpenAI } from "../hooks/openAI";
import { OpenAiFineTuningEvent } from "../models/openAI/FineTuning";
import { useAppSelector } from "../store";
import { selectTrainSettings } from "../store/train.settings.slice";
import { TrainSettings } from "./settings.train";

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "theme",
})<{
  theme: Theme
}>`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(1)};

  p {
    margin: 0;
    padding: 0;
  }
`;

export const FileTrain = () => {
  const settings = useAppSelector(selectTrainSettings);
  const { trainFile } = useOpenAI();
  const paperRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleTrain = async () => {
    const trainingEvents = await trainFile({
      params: {
        ...settings,
        suffix: settings.training_file
      },
    });

    for await (const event of trainingEvents) {
      const p = document.createElement("p");
      p.innerText = (event.chunk as OpenAiFineTuningEvent).message;
      paperRef.current!.appendChild(p);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1} width="33%" minWidth="33%" p={1}>
        <TrainSettings/>
        <Box sx={{ flexGrow: 1 }}/>
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTrain}
          >
            Train
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        width="34%"
        minWidth="34%"
        p={1}
      >
        <StyledPaper ref={paperRef} theme={theme}>
          <Typography variant="h6" component="p">
            Training Progress
          </Typography>
        </StyledPaper>
      </Box>
    </>
  );
};