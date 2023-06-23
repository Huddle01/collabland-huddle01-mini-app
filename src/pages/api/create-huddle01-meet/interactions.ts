import type { NextApiRequest, NextApiResponse } from "next";
import { SignatureVerifier } from "@/helpers";
import { InteractionType } from "discord-api-types/v10";
import {
  handleModalSubmit,
  handleApplicationCommand,
} from "@/helpers/createTokenGatedMeet";
import { handleCreateMeetAction } from "@/helpers/createMeet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verifier = new SignatureVerifier();
  verifier.verify(req, res);
  if (req.method == "POST") {
    const interaction = await req.body;
    switch (interaction.data.name) {
      case "create-huddle01-meet":
        const response = await handleCreateMeetAction(interaction);
        return res.status(200).json(response);
        break;
      case "create-huddle01-tokengated-meet":
        switch (interaction.type) {
          case InteractionType.ApplicationCommand: {
            try {
              const response = handleApplicationCommand();
              return res.status(200).json(response);
            } catch (error) {
              console.log(error);
            }
            break;
          }
          case InteractionType.ModalSubmit: {
            try {
              const response = await handleModalSubmit(interaction);
              return res.status(200).json(response);
            } catch (error) {
              console.log(error);
            }
            break;
          }
        }
    }

    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        switch (interaction.data.name) {
          case "create-huddle01-meet": {
            const response = await handleCreateMeetAction(interaction);
            return res.status(200).json(response);
            break;
          }
          case "create-huddle01-tokengated-meet": {
            try {
              const response = handleApplicationCommand();
              return res.status(200).json(response);
            } catch (error) {
              console.log(error);
            }
            break;
          }
        }
      }
      case InteractionType.ModalSubmit: {
        try {
          const response = await handleModalSubmit(interaction);
          return res.status(200).json(response);
        } catch (error) {
          console.log(error);
        }
        break;
      }
    }
  } else if (req.method == "GET") {
    return res.status(200).send("OK");
  } else {
    return res.status(405).send("Method not allowed");
  }
}
