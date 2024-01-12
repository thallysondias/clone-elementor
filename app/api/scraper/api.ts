export default async function GetWebSiteScraper() {
  try {
    const urlTeste = "https://thedesigncreators.com/";
    const urlTeste2 = "http://omnibees.local/teste-json/";
    const urlTeste3 = "https://www.arcadialuxuryvillas.com/";

    const response = await fetch(urlTeste);
    const data = await response.text();

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}
