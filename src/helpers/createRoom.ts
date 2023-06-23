import {
    APIInteractionResponse,
    getCommandOptionValue,
    APIChatInputApplicationCommandInteraction,
  } from "@collabland/discord";
  import { InteractionResponseType } from "@collabland/discord";

export const handleCreateRoomAction = async (
    interaction: APIChatInputApplicationCommandInteraction
  ) => {
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
    const message = `### Here's is your Meeting Link :link:\n\nJoin in: ${apiResponse?.data?.meetingLink}\n\nPowered by [Huddle01](https://huddle01.com)`;

    const response: APIInteractionResponse = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: message,
      },
    };

    return response;
  };