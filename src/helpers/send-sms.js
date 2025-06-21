import axios from "axios";
import https from "https";
import btoa from "btoa";

// v1
export const sendSMS = async (phoneNumber, message) => {
  const options = {
    method: "POsT",
    url: "https://sms.codearch.uz/ap/v1/sendMessage",
    headers: {
      "Content-Type": "appliocation/json",
      Accept: "application/json",
    },
    data: {
      api_key: "748e6af-b163-4b54-8676-94b3738dda5",
      phone: phoneNumber,
      message: `sizning tasdiqlash kodingiz\n ${message}`,
    },
  };
  const { data } = await axios.request(options);
  console.log(data);
};

// v2
const api_key = "22d8aaf568f5fb55";
const secret_key =
  "NWU5OTc5NzMwOGQwNjE0M2JjMTNiNWExNzkxZjViMDMyNjcxNTU2NjJiMTQzZDQ1ZGFkNWNmOWQ5ODY2ZGVkNQ==";
const content_type = "application/json";
const source_addr = "https://apisms.beem.africa/v1/send";

export const send_sms = async (phoneNumber, message) => {
  axios
    .post(
      "https://apisms.beem.africa/v1/send",
      {
        source_addr: source_addr,
        schedule_time: "",
        encoding: 0,
        message: `sizning tasdiqlash kodingiz \n${message}`,
        recipients: [
          {
            recipient_id: 1,
            dest_addr: phoneNumber,
          },
        ],
      },
      {
        headers: {
          "Content-Type": content_type,
          Authorization: "Basic " + btoa(api_key + ":" + secret_key),
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    )
    .then((response) => console.log(response, api_key + ":" + secret_key))
    .catch((error) => console.error(error.response.data));
};
