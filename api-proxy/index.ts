export default async function handler(res) {
  const apiUrl = `https://c2b-fbusiness.customs.gov.az`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  res.status(200).json(data);
}
