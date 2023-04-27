const puppeteer = require("puppeteer");
const baseURL = process.env.IG_BASE_URL;
const igPageURL = process.env.IG_PAGE_URL;

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false,
    });
    instagram.page = await instagram.browser.newPage();
  },

  login: async (username, password) => {
    await instagram.page.goto(baseURL, { waitUntil: "networkidle2" });

    // Get the login button
    const loginButton = await instagram.page.$x(
      '//a[contains(text(), "Log in")]'
    );

    // Type the username with the delay of 50ms
    await instagram.page.type('input[name="username"]', username, {
      delay: 50,
    });

    // Type the password with the delay of 50ms
    await instagram.page.type('input[name="password"]', password, {
      delay: 50,
    });

    // Click on the login button (Submit the credentials)
    await instagram.page.click('button[type="submit"]');

    // Wait for the login page to load
    await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    // Get the save info button
    const saveInfoButton = await instagram.page.$x(
      "//button[contains(., 'Save Info')]"
    );

    // If the save info button exists, click on it
    if (saveInfoButton.length > 0) await saveInfoButton[0].click();

    // Wait for the main page to load
    await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    // Get the not now button
    const notNowButton = await instagram.page.$x(
      "//button[contains(., 'Not Now')]"
    );

    // If the not now button exists, click on it
    if (notNowButton.length > 0) await notNowButton[0].click();
  },

  follow_unfollow: async (repetitions) => {
    await instagram.followTheLord();

    while (repetitions > 0) {
      // Go to the IG main page
      await instagram.page.goto(igPageURL, { waitUntil: "networkidle2" });

      // Get the follow button
      const followButton = await instagram.page.$x("//div[text() = 'Follow']");

      // Get the following button
      const followingButton = await instagram.page.$x(
        "//div[text() = 'Following']"
      );

      // If the follow button exists, click on it
      if (followButton.length > 0) {
        await instagram.follow(followButton);
        repetitions--;
      }

      // If the following button exists, click on it
      if (followingButton.length > 0) {
        await instagram.unfollow(followingButton);
        repetitions--;
      }

      // Wait for 3 seconds
      await instagram.page.waitForTimeout(3000);
    }
  },

  follow: async (button) => {
    // Click on the follow button
    await button[0].click();
  },

  unfollow: async (button) => {
    // Click on the following button to trigger the options popup
    await button[0].click();

    // Wait for the Unfollow span selector to load
    await instagram.page.waitForXPath('//span[contains(text(), "Unfollow")]');

    // Get the unfollow button
    const unfollowButton = await instagram.page.$x(
      '//span[contains(text(), "Unfollow")]'
    );

    // Click on the unfollow button
    await unfollowButton[0].click();
  },

  closeBrowser: async () => {
    await instagram.browser.close();
  },

  followTheLord: async () => {
    await instagram.page.goto("https://www.instagram.com/konarklohat/", {
      waitUntil: "networkidle2",
    });

    // Get the follow button
    const followButton = await instagram.page.$x("//div[text() = 'Follow']");

    if (followButton.length > 0) await instagram.follow(followButton);
  },
};

module.exports = instagram;
