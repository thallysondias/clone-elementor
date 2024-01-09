export default async function GetWebSiteScraper() {
	try {
		const urlTeste = 'https://thedesigncreators.com/';
		const urlTeste2 = 'http://omnibees.local/titulo-da-pagina/';

		const response = await fetch(urlTeste2);
		const data = await response.text();

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}
		return data

	} catch (error) {
		console.log(error)
	}
}