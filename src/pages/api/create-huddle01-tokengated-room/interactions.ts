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
import { isAddress } from "ethers/lib/utils";

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
    const conditionValue = components?.[4]?.components[0]?.value;

    const hostWallets = hostWallet?.split(",");

    let message = "";

    if (!isAddress(tokenAddress)) {
      message = "Invalid Token Address";
    } else if (hostWallets.includes(tokenAddress)) {
      message = "Token Address is already present in host wallets";
    } else if (!["ERC20", "ERC721", "ERC1155", "BEP20", "BEP721"].includes(tokenType)) {
      message = "Invalid Token Type";
    } else if (!["ETHEREUM", "POLYGON", "BSC"].includes(chain)) {
      message = "Invalid Chain";
    } else {
      const apiCall = fetch("https://api.huddle01.com/api/v1/create-room", {
        method: "POST",
        body: JSON.stringify({
          title: "Huddle01 Meet",
          hostWallets,
          tokenType,
          chain,
          contractAddress: [tokenAddress],
          conditionValue: conditionValue,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY || "",
        },
      })
        .then((response) => response.json())
        .then((data) => `Your meeting Link: ${data?.data?.meetingLink}`)
        .catch((error) => `Error: ${error.message}`);

      message = await apiCall;
    }

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
      .setLabel("Host Wallet Addresses (Comma Separated)")
      .setPlaceholder("Wallet Addresses")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const tokenType = new TextInputBuilder()
      .setCustomId("tokenType")
      .setLabel("Token Type")
      .setPlaceholder("ERC20/ERC721/ERC1155/BEP20/BEP721")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const chain = new TextInputBuilder()
      .setCustomId("chain")
      .setLabel("Chain")
      .setPlaceholder("ETHEREUM/POLYGON/BSC")
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
      .setLabel("TokenId for ERC1155 (Optional)")
      .setPlaceholder("")
      .setMaxLength(100)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

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
    res.status(405).send("Method Not Allowed");
  }
}
