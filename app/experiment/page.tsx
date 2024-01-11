
import * as cheerio from "cheerio";
import { parse } from 'node-html-parser';

const html = `<body data-elementor-type="1">    
<div data-id="1" data-settings="muitas"></div>
<div>
  <div>
    <div data-id="2" data-settings="outras">
        <div data-id="3" data-settings="qualquer"></div>
        <div data-id="4" data-settings="quatro"></div>
    </div>
  </div>
</div>
    <div data-id="5" data-settings="cinco">
        <div data-id="6" data-settings="6">
            <div data-id="7" data-settings="7"></div>
        </div>
    </div>
<body>`

export default async function Experiment(getAllCss, websiteData) {

    if (websiteData) {
        let htmlContent = websiteData;
        let jsonTree = createJsonFromString(html);
        //console.log(jsonTree);
        return jsonTree
    }
}

function createJsonFromString(htmlString) {
    // Parse the HTML string
    const root = parse(htmlString);

    // Use the same logic on the parsed document
    return createJsonFromHtml(root.querySelector('body'));
}

function createJsonFromHtml(element) {
    let jsonTree = [];

    function processElement(child) {
        if (child.getAttribute('data-id')) {
            let childJson = {
                id: child.getAttribute('data-id'),
                settings: child.getAttribute('data-settings'),
                elements: []
            };

            child.childNodes.forEach(grandchild => {
                if (grandchild.nodeType === 1) { // Check if the node is an element
                    childJson.elements.push(...processElement(grandchild));
                }
            });

            return [childJson];
        } else {
            let nestedElements = [];
            child.childNodes.forEach(grandchild => {
                if (grandchild.nodeType === 1) { // Check if the node is an element
                    nestedElements.push(...processElement(grandchild));
                }
            });
            return nestedElements;
        }
    }

    element.childNodes.forEach(child => {
        if (child.nodeType === 1) { // Check if the node is an element
            jsonTree.push(...processElement(child));
        }
    });

    return jsonTree;
}