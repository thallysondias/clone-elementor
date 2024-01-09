import * as cheerio from 'cheerio';

export default async function GetAllCss(websiteData: any) {
	try {
		const $ = cheerio.load(websiteData);
		const elementorIds: number[] = [];

		$('[data-elementor-id]').each((_, element: cheerio.Element) => {
			const id = $(element).data('elementor-id');
			if (typeof id === 'number') {
				elementorIds.push(id);
			}
		});

		const cssFinal = await getCombinedCss(websiteData, elementorIds);
		return cssFinal
	} catch (error) {
		console.error(error);
	}
}

export async function getCombinedCss(html: string, elementorIds: number[]) {
	const $ = cheerio.load(html);
	let combinedCss = '';

	for (const id of elementorIds) {
		const cssLink = $(`link[id='elementor-post-${id}-css']`).attr('href');
		if (cssLink) {
			const response = await fetch(cssLink, { cache: 'no-store' });
			const cssText = await response.text();
			combinedCss += cssText;
		}
	}

	return combinedCss;
}
