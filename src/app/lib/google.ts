import { google } from "googleapis";

export function getGoogleClient(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiresAt
  });

  return auth;
}

export async function listEmails(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}) {
  const auth = getGoogleClient(tokens);
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5
  });
  console.log("Emails:", res.data.messages);
  return res.data.messages;
}

export async function createCalenderWithMeet({
  tokens,
  summary,
  description,
  startTime,
  endTime,
  attendees,
  isMeetRequired
}: {
  tokens: any;
  summary: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  attendees?: { email: string }[];
  isMeetRequired: boolean;
}) {
  const auth = getGoogleClient(tokens);
  const calendar = google.calendar({ version: "v3", auth });
  let input: any = {
    calendarId: "primary",
    // conferenceDataVersion: 1,
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata"
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata"
      },
      attendees,
      // conferenceData: {
      //   createRequest: {
      //     requestId: crypto.randomUUID()
      //   }
      // }
    }
  }
  if (isMeetRequired) {
    input.conferenceDataVersion = 1;
    input.requestBody.conferenceData = {
      createRequest: {
        requestId: crypto.randomUUID(),
      }
    }
  }

  const event = await calendar.events.insert(input);

  return event.data;

}

export async function getGoogleAccountInfo(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}) {
  const auth = getGoogleClient(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth });
  const res = await oauth2.userinfo.get();
  return res.data;
}