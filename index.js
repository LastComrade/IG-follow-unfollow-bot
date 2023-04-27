require("dotenv").config();
const ig = require("./instagram");
const username = process.env.IG_USERNAME;
const password = process.env.IG_PASSWORD;
const repetitions = parseInt(process.env.IG_REPETITIONS);

(async () => {
  await ig.initialize();

  await ig.login(username, password);

  await ig.follow_unfollow(2 * repetitions);

  await ig.closeBrowser();
})();
