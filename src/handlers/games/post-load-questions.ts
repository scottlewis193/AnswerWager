import express from "express";
import { GAMESTORE } from "../../server";
import { CSVToJSON } from "../../utils";

const loadQuestions = async (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const QUESTIONFILE = (req.file as Express.Multer.File).path;

  GAME.questions = await CSVToJSON(QUESTIONFILE);

  return res.status(200).send("Successfully uploaded files");
};

export { loadQuestions };
