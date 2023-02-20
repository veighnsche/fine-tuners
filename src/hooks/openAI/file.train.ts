import wretch from "wretch";
import { useAuth } from "../../auth/hooks";
import { authFailed } from "../../auth/auth.slice";
import { OpenAiFineTune, OpenAiFineTuningEvent, OpenAiFineTuningParams } from "../../models/openAI/FineTuning";
import { useAppDispatch } from "../../store";

interface UseFileTrainParams {
  params: OpenAiFineTuningParams;
}

export const useFileTrain = () => {
  const { getApiKey } = useAuth();
  const dispatch = useAppDispatch();

  return async function* ({ params }: UseFileTrainParams) {
    const apiKey = await getApiKey();
    const res = await wretch("https://api.openai.com/v1/fine-tunes")
      .auth(`Bearer ${apiKey}`)
      .post(params)
      .unauthorized(() => {
        dispatch(authFailed());
        throw new Error("OpenAI API request failed");
      })
      .json<OpenAiFineTune>();

    console.log("res", res);

    const eventList = await wretch(`https://api.openai.com/v1/fine-tunes/${res.id}/events?stream=true`)
      .auth(`Bearer ${apiKey}`)
      .get()
      .res();

    if (!eventList.ok || !eventList.body) {
      throw new Error("OpenAI API request failed");
    }

    const reader = eventList.body.getReader();

    readerLoop: while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const decoded = new TextDecoder("utf-8")
        .decode(value);

      console.log("decoded", decoded);

      const filtered = decoded
        .split("data: ");

      for (const data of filtered) {
        const trimmed = data.trim();
        if (trimmed === "") {
          continue;
        }

        if (trimmed === "[DONE]") {
          yield {
            chunk: "",
            done: true,
          };
          break readerLoop;
        }

        const parsed: OpenAiFineTuningEvent = JSON.parse(trimmed);

        yield {
          chunk: parsed,
          done: false,
        };
      }
    }
  };
};