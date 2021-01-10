const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/event", async (req, res) => {
  const body = req.body;
  if (body.challenge) {
    return res.status(200).json({ challenge: body.challenge });
  }
  res.status(200).send();
  if (body.event.type === "reaction_added") {
    console.log("Add user to group");
    const result = await fetch("https://slack.com/api/usergroups.list", {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}` },
    });
    const userGroups = await result.json();
    if (body.event.reaction === "computer") {
      const userGroup = userGroups.usergroups.filter(
        (group) => group.handle === "test_self_role"
      )[0];

      const result = await fetch(
        `https://slack.com/api/usergroups.users.list?usergroup=${userGroup.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}` },
        }
      );
      const userGroupList = await result.json();
      const formattedUserGroup = [
        ...userGroupList.users,
        body.event.item_user,
      ].join(",");
      console.log(formattedUserGroup);

      const updateResult = await fetch(
        `https://slack.com/api/usergroups.users.update`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
            Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
          },
          body: JSON.stringify({
            usergroup: userGroup.id,
            team_id: userGroup.team_id,
            users: formattedUserGroup,
          }),
        }
      );
      console.log(await updateResult.json());

      console.log(`Add user ${body.event.item_user} to usergroup`);
    }
    const datasUserGroup = userGroups.usergroups.filter(
      (group) => group.handle === "datas"
    )[0];
  }
});

app.listen(port, () => {
  console.log(`I'm listening on http://localhost:${port}`);
});
