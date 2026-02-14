import axios from "axios";

const getBase64Image = async (pathOrUrl: string) => {
  const response = await axios.get(pathOrUrl, {
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data).toString("base64");
};

export default getBase64Image;
