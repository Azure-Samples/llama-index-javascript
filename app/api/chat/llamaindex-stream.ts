import {
  StreamData,
  createCallbacksTransformer,
  createStreamDataTransformer,
  trimStartOfStreamHelper,
  type AIStreamCallbacksAndOptions,
} from "ai";

import {
  Metadata,
  NodeWithScore,
  EngineResponse,
  ToolCallLLMMessageOptions,
} from "llamaindex";

import { appendImageData, appendSourceData } from "./stream-helper";

type LlamaIndexResponse =
  | ReadableStream<ToolCallLLMMessageOptions> 
  | EngineResponse;

type ParserOptions = {
  image_url?: string;
};

function createParser(
  res: AsyncIterable<LlamaIndexResponse>,
  data: StreamData,
  opts?: ParserOptions,
) {
  const it = res[Symbol.asyncIterator]();
  const trimStartOfStream = trimStartOfStreamHelper();

  let sourceNodes: NodeWithScore<Metadata>[] | undefined;
  return new ReadableStream<string>({
    start() {
      appendImageData(data, opts?.image_url);
    },
    async pull(controller): Promise<void> {
      const { value, done } = await it.next();
      if (done) {
        if (sourceNodes) {
          appendSourceData(data, sourceNodes);
        }
        controller.close();
        data.close();
        return;
      }

      let delta;
      if (value instanceof EngineResponse) {
        // handle Response type
        if (value.sourceNodes) {
          // get source nodes from the first response
          sourceNodes = value.sourceNodes;
        }
        delta = value.response ?? "";
      }
      const text = trimStartOfStream(delta ?? "");
      if (text) {
        controller.enqueue(text);
      }
    },
  });
}

export function LlamaIndexStream(
  response: AsyncIterable<LlamaIndexResponse>,
  data: StreamData,
  opts?: {
    callbacks?: AIStreamCallbacksAndOptions;
    parserOptions?: ParserOptions;
  },
): ReadableStream<Uint8Array> {
  return createParser(response, data, opts?.parserOptions)
    .pipeThrough(createCallbacksTransformer(opts?.callbacks))
    .pipeThrough(createStreamDataTransformer());
}
