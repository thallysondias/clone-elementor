import * as cheerio from "cheerio";
import { PageSettings } from "@/lib/interface";

export default async function GetContent(
    getAllCss: any,
    websiteData: string) {
    const $ = cheerio.load(websiteData);
    const content = [];

    $('.elementor-element').each((_, element) => {
        // Verifica se o elemento é um elemento "raiz" (não é filho de outro elementoor-element)
        if (!$(element).parent().hasClass('elementor-element')) {
            const item = processElement(element, $);
            content.push(item);
        }
    });

		console.log("_____")
   console.log(content)
    //return content;

}


function processElement(element: any, $: any) {
    const elementType = $(element).data('element_type');
    const elementId = $(element).data('id');
    const settings = $(element).data('settings') ? $(element).data('settings') : {};
		const widgetType = $(element).data('widget_type') ? $(element).data('widget_type').replace('.default', '') : {};
		
    const item = {
        id: elementId,
        elType: elementType,
				widgetType: widgetType,
        settings: settings,
        elements: []
    };

    // Processa os elementos filhos recursivamente
    $(element).children('.elementor-element').each((_, childElement) => {
        const childItem = processElement(childElement, $);
        item.elements.push(childItem);
    });

    return item;
}