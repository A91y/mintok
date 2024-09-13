import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  ActionError,
} from "@solana/actions";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const baseHref = new URL(
      `/api/actions/mint-spl`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "Mintok - Mint SPL Tokens",
      icon: new URL("/logo.png", requestUrl.origin).toString(),
      description: "Mint SPL tokens",
      label: "Mint",
      links: {
        actions: [
          {
            label: "Mint",
            href: `${baseHref}?amount={amount}&tokenMint={tokenMint}`,
            parameters: [
              {
                name: "tokenMint",
                type: "text",
                label: "The SPL token mint address",
                required: true,
              },
              {
                name: "amount",
                type: "number",
                label: "The amount of SOL to mint",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, tokenMint } = validatedQueryParams(requestUrl);
    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }
    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta")
    );

    const mint = tokenMint;

    // get the associated token address
    const ata = await getAssociatedTokenAddress(
      mint,
      account,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // check if the associated token account exists
    const ataAccountInfo = await connection.getAccountInfo(ata);

    const createATAInstruction = createAssociatedTokenAccountInstruction(
      account,
      ata,
      account,
      mint,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    let transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    });
    let message;

    console.log("ataAccountInfo", ataAccountInfo);

    if (!ataAccountInfo) {
      // create the associated token account
      transaction = transaction
        .add(createATAInstruction)
        // mint the tokens
        .add(
          createMintToInstruction(mint, ata, account, amount * LAMPORTS_PER_SOL)
        );
      message = `Created associated token account ${ata.toBase58()}. \n Minted ${amount} tokens to ${account.toBase58()}`;
    } else {
      // mint the tokens
      transaction = transaction.add(
        createMintToInstruction(mint, ata, account, amount * LAMPORTS_PER_SOL)
      );
      message = `Minted ${amount} tokens to ${account.toBase58()}`;
    }

    console.log("transaction", transaction);
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message,
      },
    });
    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let amount: number;
  let tokenMint: PublicKey;

  try {
    if (requestUrl.searchParams.get("tokenMint")) {
      tokenMint = new PublicKey(requestUrl.searchParams.get("tokenMint")!);
    } else {
      throw "Invalid input query parameter: tokenMint";
    }
  } catch (err) {
    throw "Invalid input query parameter: tokenMint";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    } else {
      throw "Invalid input query parameter: amount";
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    tokenMint,
  };
}
