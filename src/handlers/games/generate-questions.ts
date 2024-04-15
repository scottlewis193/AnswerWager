import express from "express";
import { GAMESTORE } from "../../server";
import { CSVToJSON } from "../../utils";
import { Question } from "../../store/questions";
import moment from "moment";
import {
  ChatGPTAPI,
  ChatGPTAPIOptions,
  ChatGPTUnofficialProxyAPI,
} from "chatgpt";
import { OpenAI } from "openai";

const generateQuestions = async (
  req: express.Request,
  res: express.Response
) => {
  const GAME = GAMESTORE.Games[Number(req.params.gameId)];

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
  });

  //   (async () => {
  //     const api = new ChatGPTAPI({
  //       apiBaseUrl: process.env.OPENAI_API_BASE_URL || "https://api.openai.com",
  //       apiKey: process.env.OPENAI_API_KEY || "",
  //       model: "pai-001",
  //     });

  (async () => {
    const chatCompletion = await openai.chat.completions.create({
      model: "pai-001",
      messages: [
        {
          role: "user",
          content:
            "generate 5 questions with a numeric based answer in a csv format.",
        },
      ],
    });

    console.log(chatCompletion.choices[0].message.content);

    GAME.questions;

    //convert answers that are dates to milliseconds
    GAME.questions.forEach((question: Question) => {
      if (question.answerType == "date") {
        question.answer = moment(question.answer, "DD-MM-YYYY")
          .toDate()
          .getTime();
      }
    });

    return res.status(200).send("Successfully uploaded files");
  })();
};

async function sendMessage() {}

export { generateQuestions };
