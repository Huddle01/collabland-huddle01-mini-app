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
    const chain = components?.[0]?.components[0]?.value;
    const tokenType = components?.[1]?.components[0]?.value;
    const tokenAddress = components?.[2]?.components[0]?.value;
    const conditionType = components?.[3]?.components[0]?.value;
    const conditionValue = components?.[4]?.components[0]?.value;

    let apiCall;

    if (!conditionType && !conditionValue) {
      apiCall = await fetch(
        "https://iriko.testing.huddle01.com/api/v1/create-iframe-room",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Huddle01 Meet",
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
    } else if (conditionValue) {
      apiCall = await fetch(
        "https://iriko.testing.huddle01.com/api/v1/create-iframe-room",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Huddle01 Meet",
            tokenType: tokenType,
            chain: chain,
            contractAddress: [tokenAddress],
            conditionValue: conditionValue,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY || "",
          },
        }
      );
    } else {
      apiCall = await fetch(
        "https://iriko.testing.huddle01.com/api/v1/create-iframe-room",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Huddle01 Meet",
            tokenType: tokenType,
            chain: chain,
            contractAddress: [tokenAddress],
            conditionType: conditionType,
            conditionValue: conditionValue,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY || "",
          },
        }
      );
    }

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

    const conditionValue = new TextInputBuilder()
      .setCustomId("conditionValue")
      .setLabel("Condition Value")
      .setPlaceholder("Value for Lens and Cyberconnect/TokenId for ERC1155")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const conditionType = new TextInputBuilder()
      .setCustomId("conditionType")
      .setLabel("Condition Type")
      .setPlaceholder("FOLLOW_HANDLE, HAVE_HANDLE")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        chain
      );
    modal.addComponents(firstActionRow);
    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        tokenType
      );
    modal.addComponents(secondActionRow);
    const thirdActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        tokenAddress
      );
    modal.addComponents(thirdActionRow);
    const fourthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        conditionType
      );
    modal.addComponents(fourthActionRow);
    const fifthActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        conditionValue
      );
    modal.addComponents(fifthActionRow);

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
