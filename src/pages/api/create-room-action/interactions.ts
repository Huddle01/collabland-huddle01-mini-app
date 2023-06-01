import type { NextApiRequest, NextApiResponse } from "next";
import { SignatureVerifier } from "@/helpers";
import {
  APIInteractionResponse,
  APIModalSubmitInteraction,
  InteractionResponseType,
  TextInputStyle,
} from "@collabland/discord";
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "discord.js";
import { InteractionType } from "discord-api-types/v10";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  async function handleModalSubmit(
    interaction: APIModalSubmitInteraction
  ): Promise<APIInteractionResponse> {
    const components = interaction?.data?.components;
    const hostWallet = components?.[0]?.components[0]?.value;
    const roomLocked = components?.[1]?.components[0]?.value;

    const hostWallets = hostWallet?.split(",");

    const apiCall = await fetch("https://api.huddle01.com/api/v1/create-room", {
      method: "POST",
      body: JSON.stringify({
        title: "Huddle01 Meet",
        hostWallets: hostWallets,
        roomLocked: roomLocked,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || "",
      },
    });

    const apiResponse = await apiCall.json();

    const message = `Your meeting Link: ${apiResponse?.data?.meetingLink}`;

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: message,
      },
    };
  }

  function handleApplicationCommand(): APIInteractionResponse {
    const modal = new ModalBuilder().setCustomId(`submit`).setTitle("Submit");

    const hostWallet = new TextInputBuilder()
      .setCustomId("hostWallet")
      .setLabel("Host Wallet Address")
      .setPlaceholder("Wallet Address")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const tokenType = new TextInputBuilder()
      .setCustomId("roomLocked")
      .setLabel("Do you want room Locked")
      .setPlaceholder("true/false")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setValue("false")
      .setRequired(true);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        hostWallet
      );
    modal.addComponents(firstActionRow);

    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        tokenType
      );
    modal.addComponents(secondActionRow);

    const response: APIInteractionResponse = {
      type: InteractionResponseType.Modal,
      data: {
        ...modal.toJSON(),
      },
    };

    return response;
  }

  if (req.method == "POST") {
    const interaction = req.body;

    const verifier = new SignatureVerifier();
    verifier.verify(req, res);
    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        try {
          const response = handleApplicationCommand();
          res.status(200).json(response);
        } catch (error) {
          console.log(error);
        }
        break;
      }
      case InteractionType.ModalSubmit: {
        try {
          const response = await handleModalSubmit(interaction);
          res.status(200).json(response);
        } catch (error) {
          console.log(error);
        }
        break;
      }
    }
  } else if (req.method == "GET") {
    res.status(200).send("OK");
  } else {
    res.status(405).end();
  }
}
