import GetWebSiteScraper from '../api/scraper/api';
import GetAllCss from '../api/scraper/getAllCss';
import GetPageSettings from '../api/scraper/getPageSettings';
import * as cheerio from 'cheerio';

export default async function Viewer() {
	const websiteData = await GetWebSiteScraper();

	if (websiteData) {

		const $ = cheerio.load(websiteData);
		const getAllCss = await GetAllCss(websiteData);

		const pageSettings = await GetPageSettings(getAllCss, websiteData);
		
		const titleWebsite = $('meta').text();
		//console.log("novo" + getAllCss)

		const json = {
			title: `Elementor Clone - ${titleWebsite}`,
			type: "page",
			version: "1",
			page_settings: [],
			content: []
		};


	}

	return (
		<div>

			Teste 
		</div>
	);

}


