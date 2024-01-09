export default async function GetWebSiteScraper() {
	try {
		const urlTeste = 'https://thedesigncreators.com/';
		const urlTeste2 = 'http://testes.local/pagina-mais-simples/';

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