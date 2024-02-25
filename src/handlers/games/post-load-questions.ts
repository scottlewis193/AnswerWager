

const loadQuestions = async (req : express.Request, res : express.Response) => {
    const GAMEID = Number(req.params.gameId);
    const QUESTIONFILE = (req.file as Express.Multer.File).path ;
  
    aw.games[GAMEID].questions = await utils.CSVToJSON(QUESTIONFILE);
  
    return res.status(200).send("Successfully uploaded files");
  };