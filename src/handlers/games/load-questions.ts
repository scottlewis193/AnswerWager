import express from "express";
import { GAMESTORE } from "../../server";
import { CSVToJSON } from "../../utils";
import { Question } from "../../store/questions";
import moment from "moment";

const loadQuestions = async (req: express.Request, res: express.Response) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];
  const QUESTIONFILE = (req.file as Express.Multer.File).path;

  GAME.questions = await CSVToJSON(QUESTIONFILE);

  //convert answers that are dates to milliseconds
  GAME.questions.forEach((question: Question) => {
    if (question.answerType == "date") {
      question.answer = moment(question.answer, "DD-MM-YYYY")
        .toDate()
        .getTime();
    }
  });

  return res.status(200).send("Successfully uploaded files");
};

export { loadQuestions };
