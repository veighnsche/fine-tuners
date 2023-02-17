import wretch from "wretch";
import { useAuth } from "../auth/auth.hook";
import { authFailed, authSuccess } from "../auth/auth.slice";
import { removeEncryptedPasswordFromSession } from "../auth/encryptedPassword.store";
import { OpenAiCreateCompletionParameters, OpenAICreateCompletionResponse } from "../models/openAI/CreateCompletion";
import { useAppDispatch, useAppSelector } from "../store";
import { selectLinesForUpload } from "../store/lines.slice";
import { createJsonLFile } from "../utils/files";

export function useOpenAI() {
  const { getApiKey } = useAuth();
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectLinesForUpload);

  return {
    async testAuth({
                     encryptedPassword,
                   }: {
      encryptedPassword?: string
    } = {}): Promise<boolean> {
      const apiKey = await getApiKey({ encryptedPassword });

      const success = await wretch("https://api.openai.com/v1/models/davinci")
        .auth(`Bearer ${apiKey}`)
        .get()
        .unauthorized(() => false)
        .json()
        .then(() => true)
        .catch(() => false);

      if (success) {
        dispatch(authSuccess());
        return true;
      }
      dispatch(authFailed());
      await removeEncryptedPasswordFromSession();
      return false;
    },

    async* createCompletion({
                              params,
                            }: {
      params: OpenAiCreateCompletionParameters;
    }): AsyncGenerator<{
      chunk: string;
      done: boolean;
    }> {
      const apiKey = await getApiKey();
      const res = await wretch("https://api.openai.com/v1/completions")
        .auth(`Bearer ${apiKey}`)
        .post({
          ...params,
          stream: true,
        })
        .res();

      if (!res.ok || !res.body) {
        throw new Error("OpenAI API request failed");
      }

      dispatch(authSuccess());
      const reader = res.body.getReader();

      readerLoop:
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          const filtered = new TextDecoder("utf-8")
            .decode(value)
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

            const parsed: OpenAICreateCompletionResponse = JSON.parse(trimmed);
            const text = parsed.choices[0].text;
            yield {
              chunk: text,
              done: false,
            };
          }
        }
    },
    async uploadCurrentLines() {
      const file: File = createJsonLFile({
        lines,
        name: "test",
      });

      const apiKey = await getApiKey();

      const formData = new FormData();
      formData.append("purpose", "fine-tune");
      formData.append("file", file);

      const res = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("OpenAI API request failed");
      }

      const json = await res.json();
      console.log(json);
    },
  };
}