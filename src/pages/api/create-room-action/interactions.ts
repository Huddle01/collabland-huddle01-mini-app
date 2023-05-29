import type { NextApiRequest, NextApiResponse } from "next";
import { SignatureVerifier } from "@/helpers";
import {
  APIInteractionResponse,
  getCommandOptionValue,
} from "@collabland/discord";
import { InteractionResponseType, MessageFlags } from "@collabland/discord";

export const config = {
  runtime: 'edge',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verifier = new SignatureVerifier();
  verifier.verify(req, res);

  const interaction = await req.body;
  const hostWallet = getCommandOptionValue(interaction, "host-wallets");

  const hostWallets = hostWallet?.split(",");

  const apiCall = await fetch(
    "https://iriko.testing.huddle01.com/api/v1/create-iframe-room",
    {
      method: "POST",
      body: JSON.stringify({
        title: "Huddle01 Meet",
        hostWallets: hostWallets,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || "",
      },
    }
  );

  const apiResponse = await apiCall.json();
  const message = `Your meeting Link: ${apiResponse.data.meetingLink}`;

  /**
   * Build a simple Discord message private to the user
   */
  const response: APIInteractionResponse = {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: message,
      flags: MessageFlags.Ephemeral,
    },
  };
  
  res.status(200).json(response);
}
