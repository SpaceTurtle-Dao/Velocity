import { connect, createDataItemSigner, ConnectResult, Message, DryRunResult } from '@permaweb/aoconnect';
// import { createToast } from './utils/toastHandler.svelte';

interface Tag {
  name: string;
  value: string;
}

interface MessageResult {
  Messages: Message[];
  Spawns: unknown[];
  Output: unknown;
  Error?: string;
}

const { result, message, dryrun } = connect({
  MU_URL: 'https://mu.ao-testnet.xyz',
  CU_URL: 'https://cu.ao-testnet.xyz',
  GATEWAY_URL: 'https://arweave.net'
}) as ConnectResult;

declare global {
  interface Window {
    arweaveWallet: any;
  }
}

export const send = async (processId: string, tags: Tag[], toastId: string | number): Promise<void> => {
  console.log("Sending message to: " + processId);

  const messageId = await message({
    process: processId,
    tags: tags,
    signer: createDataItemSigner(window.arweaveWallet)
  });

  console.log(messageId);
  await readMessage(messageId, processId, toastId);
};

export const read = async (processId: string, tags: Tag[]): Promise<Message | undefined> => {
  console.log("Sending message to: " + processId);

  const result = await dryrun({
    process: processId,
    tags: tags
  }) as DryRunResult;

  console.log(result.Messages);
  const message = result.Messages.pop();
  console.log(message);
  return message;
};

const readMessage = async (messageId: string, processId: string, toastId: string | number): Promise<void> => {
  const { Messages, Spawns, Output, Error } = await result({
    message: messageId,
    process: processId
  }) as MessageResult;

  if (!Error) {
    const message = Messages.pop();
    if (message) {
      const data = JSON.parse(message.Data as string);
      // createToast(data.code, data.description, data.label, `https://www.ao.link/#/message/${messageId}`, toastId);
    }
  }

  console.log(Messages);
  console.log("Spawns: " + JSON.stringify(Spawns));
  console.log(Output);
  console.log(Error);

  if (Error) {
    throw Error;
  }
};
