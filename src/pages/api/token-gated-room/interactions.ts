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
    const chain = components?.[1]?.components[0]?.value;
    const tokenType = components?.[2]?.components[0]?.value;
    const tokenAddress = components?.[3]?.components[0]?.value;

    const hostWallets = hostWallet?.split(",");

    const apiCall = await fetch(
      "https://iriko.testing.huddle01.com/api/v1/create-iframe-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Huddle01 Meet",
          hostWallets: hostWallets,
          tokenType: tokenType,
          chain: chain,
          contractAddress: [tokenAddress],
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY || "",
        },
      }
    );

    const apiResponse = await apiCall.json();

    const message = `Your meeting Link: ${apiResponse?.data?.meetingLink}`;

    console.log(tokenAddress, hostWallets, chain, tokenType)

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
      .setCustomId("tokenType")
      .setLabel("Token Type")
      .setPlaceholder("ERC20/ERC721/ERC1155/SPL/BEP20")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const chain = new TextInputBuilder()
      .setCustomId("chain")
      .setLabel("Chain")
      .setPlaceholder("ETHEREUM/COSMOS/SOLANA/TEZOS/BSC")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const tokenAddress = new TextInputBuilder()
      .setCustomId("tokenAddress")
      .setLabel("Token Address")
      .setPlaceholder("")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        hostWallet
      );
    modal.addComponents(firstActionRow);
    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        chain
      );
    modal.addComponents(secondActionRow);
    const thirdActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        tokenType
      );
    modal.addComponents(thirdActionRow);
    const fourthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        tokenAddress
      );
    modal.addComponents(fourthActionRow);

    const response: APIInteractionResponse = {
      type: InteractionResponseType.Modal,
      data: {
        ...modal.toJSON(),
      },
    };

    return response;
  }

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
}
