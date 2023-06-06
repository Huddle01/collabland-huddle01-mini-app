import type { NextApiRequest, NextApiResponse } from "next";
import { SignatureVerifier } from "@/helpers";
import {
  APIInteractionResponse,
  getCommandOptionValue,
} from "@collabland/discord";
import { InteractionResponseType, MessageFlags } from "@collabland/discord";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verifier = new SignatureVerifier();
  verifier.verify(req, res);

  if (req.method == "POST") {
    const interaction = await req.body;
    const hostWallet = getCommandOptionValue(interaction, "host-wallets") ?? "";

    const hostWallets = hostWallet?.split(",") ?? [];

    const apiCall = await fetch("https://api.huddle01.com/api/v1/create-room", {
      method: "POST",
      body: JSON.stringify({
        title: "Huddle01 Meet",
        hostWallets: hostWallets,
        roomLocked: hostWallets.some((wallet) => wallet.trim().length <= 10)
          ? false
          : true,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || "",
      },
    });

    const apiResponse = await apiCall.json();
    const message = `Your meeting Link: ${apiResponse.data.meetingLink}`;

    const response: APIInteractionResponse = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: message,
        flags: MessageFlags.Ephemeral,
      },
    };

    res.status(200).json(response);
  } else if (req.method == "GET") {
    res.status(200).send("OK");
  } else {
    res.status(405).send("Method not allowed");
  }
}
