// import UserData from "../models/userData.model.js";
import axios from "axios";

// export const httpAddUserData = async (req, res) => {
//   try {
//     const { groupName, entries } = req.body;

//     if (!groupName || !entries || !Array.isArray(entries)) {
//       return res.status(400).json({ error: "Invalid data" });
//     }

//     const data = {
//       groupName,
//       entries: entries.map((entry) => ({
//         fieldName: entry.fieldName,
//         value: entry.value,
//       })),
//     };

//     const newUserData = new UserData(data);
//     await newUserData.save();
//     res.status(201).json({ message: "Data added successfully", data: data });
//   } catch (error) {
//     console.error("Error in adding the data", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

export const httpGetApprovalDetails = async (req, res) => {
  const { ticket, action, user, supervisor } = req.query;

  if (!ticket || !action || !user) {
    return res.status(400).send("Invalid approval link.");
  }

  try {
    // 1. Update DB (you can uncomment and customize this line)
    // await Ticket.updateOne({ _id: ticket }, { status: action, approvedBy: user });

    // 2. Prepare email details
    const emailBody = [
      `Hi,<br><br>The ticket <b>${ticket}</b> has been <b>${action}d</b> by <b>${supervisor}</b>.<br><br>Thanks,<br>Team`,
    ];

    const teamsContent = [
      `${user}| ${supervisor} has ${action}d extra hours for the ticket ${ticket}.`,
    ];
    const subject = [`Ticket ${ticket} ${action}d`];
    const toMailId = ["lokesh.dontula@accenture.com"]; // Update as needed
    const ccMailId = ["m.amarnath.yadav@accenture.com"]; // Optional

    // 3. Send Email Notification
    await axios.post(
      "https://mailnotications.azurewebsites.net/api/MailNotications",
      {
        EmailBody: emailBody,
        Subject: subject,
        CCMailId: ccMailId,
        ToMailId: toMailId,
      },
      {
        headers: {
          "x-functions-key":
            "Vy-qplY3DyuACQacUnfmFTVYm0jhSqhcPdt8crdBAdZTAzFu3wOX9A==",
          "Content-Type": "application/json",
        },
      }
    );

    await axios.post(
      "http://sendteamsnotification.azurewebsites.net/api/SendTeamsNotification",
      {
        TeamIds: teamsContent,
        Message: [
          `User ${user} has ${action}d extra hours for the ticket ${ticket}.`,
        ],
      },

      {
        headers: {
          "x-functions-key":
            "FSE8UpGQJQnhtekkatwaYxH0JC/PZg9QmT4uIgJwjQlfhBo8jAeqZg==",
          "Content-Type": "application/json",
        },
      }
    );

    // 4. Respond back to frontend
    res.send(
      `Ticket ${ticket} has been ${action}d by ${user}. conformation sent for the same.`
    );
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).send("Something went wrong during approval action.");
  }
};
