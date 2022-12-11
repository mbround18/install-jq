const { default: axios } = require("axios");
const core = require("@actions/core");
const github = require("@actions/github");
try {
  // `who-to-greet` input defined in action metadata file
  let tag = core.getInput("tag");
  let fetchReleaseUrl;

  if (tag.toLowerCase() === "latest") {
    fetchReleaseUrl = `https://api.github.com/repos/stedolan/jq/releases/latest`;
  } else {
    fetchReleaseUrl = `https://api.github.com/repos/stedolan/jq/releases/tags/${tag}`;
  }

  console.log({ status: "fetching", fetchReleaseUrl });
  axios
    .get(fetchReleaseUrl)
    .then((response) => axios.get(response.data.assets_url))
    .then(({ data }) =>
      Promise.resolve(data.find(({ name }) => name.includes("linux64")))
    )
    .then(({ browser_download_url }) => {
      console.log({
        browser_download_url,
        action_path: github.action_path,
      });
    });
} catch (error) {
  core.setFailed(error.message);
}
