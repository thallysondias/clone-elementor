import GetWebSiteScraper from "../api/scraper/api";
import GetAllCss from "../api/scraper/getAllCss";
import GetPageSettings from "../api/scraper/getPageSettings";
import GetContent from "../api/scraper/getContent";
import * as cheerio from "cheerio";

export default async function Viewer() {
  const websiteData = await GetWebSiteScraper();

  if (websiteData) {
    const $ = cheerio.load(websiteData);
    const getAllCss = await GetAllCss(websiteData);

    const pageSettingsData = await GetPageSettings(getAllCss, websiteData);
		const contentData = await GetContent(getAllCss, websiteData);
    const titleWebsite = $("title").text();


    const json = {
      title: `Elementor Clone - ${titleWebsite}`,
      type: "page",
      version: "0.4",
      page_settings: pageSettingsData?.page_settings || [],
      content: [],
    };

    //console.log(json);
		//const item = JSON.stringify(json)
		//console.log(item);
  }

  return <div>Teste</div>;
}
