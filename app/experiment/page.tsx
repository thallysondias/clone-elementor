import { parse } from "node-html-parser";
import { PageContent, JsonStructure } from "@/lib/interface";

export default async function Experiment(getAllCss: any, websiteData: string): Promise<JsonStructure> {
  let jsonTree: PageContent[] = []; // jsonTree is an array of PageContent

  if (websiteData) {
    jsonTree = createJsonFromString(websiteData);
    //console.log(jsonTree);
  }

  return { jsonTree }; // return jsonTree wrapped in an object
}

function createJsonFromString(websiteData: string): PageContent[] {
  // Parse the HTML string
  const root = parse(websiteData);

  // Use the same logic on the parsed document
  return createJsonFromHtml(root.querySelector("body"));
}

function createJsonFromHtml(element: any): PageContent[] {
  let jsonTree: PageContent[] = [];

  function processElement(child: any): PageContent[] {
    if (child.getAttribute("data-id")) {
      let childJson: PageContent = {
        id: child.getAttribute("data-id"),
        element_type: child.getAttribute("data-element_type"),
        settings: child.getAttribute("data-settings"),
        elements: [],
      };

      let widgetType = child.getAttribute("data-widget_type");
      if (widgetType) {
        widgetType = widgetType.trim().replace(/\.default/g, "");
        childJson.widget_type = widgetType;
      }

      child.childNodes.forEach((grandchild: any) => {
        if (grandchild.nodeType === 1) { // Check if the node is an element
          childJson.elements.push(...processElement(grandchild));
        }
      });

      return [childJson];
    } else {
      let nestedElements: PageContent[] = [];
      child.childNodes.forEach((grandchild: any) => {
        if (grandchild.nodeType === 1) { // Check if the node is an element
          nestedElements.push(...processElement(grandchild));
        }
      });
      return nestedElements;
    }
  }

  element.childNodes.forEach((child: any) => {
    if (child.nodeType === 1) { // Check if the node is an element
      jsonTree.push(...processElement(child));
    }
  });

  return jsonTree;
}