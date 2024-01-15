import { parse, HTMLElement } from "node-html-parser";
import { PageContent, JsonStructure } from "@/lib/interface";

export default async function GetContent(
  getAllCss: any,
  websiteData: string
): Promise<JsonStructure> {

  return {
    content: websiteData ? createJsonFromString(websiteData) : [] 
  };
}

function createJsonFromString(websiteData: string): PageContent[] {
  const root = parse(websiteData);
  const bodyElement = root.querySelector("body");
  return bodyElement ? createJsonFromHtml(bodyElement) : [];
}

function createJsonFromHtml(element: HTMLElement): PageContent[] {
  return Array.from(element.childNodes)
    .filter((child): child is HTMLElement => child.nodeType === 1)
    .flatMap(processElement);
}

function processElement(child: HTMLElement): PageContent[] {
  const elementType = child.getAttribute("data-element_type") ?? null;
  if (elementType === null) {
    return child.childNodes.flatMap((childNode) =>
      childNode.nodeType === 1 ? processElement(childNode as HTMLElement) : []
    );
  }

  let widgetType =
    child
      .getAttribute("data-widget_type")
      ?.trim()
      .replace(/\.default/g, "") ?? null;
  let settings = parseSettings(child.getAttribute("data-settings"));

  let childJson: PageContent = {
    id: child.getAttribute("data-id") ?? null,
    settings: settings,
    elements: child.childNodes.flatMap((grandchild) =>
      grandchild.nodeType === 1 ? processElement(grandchild as HTMLElement) : []
    ),
    isInner: false,
    elType: elementType,
  };

  if (widgetType !== null) {
    childJson.widget_type = widgetType;
  }

  return [childJson];
}

function parseSettings(settings: string | undefined): any {
  if (settings === undefined) {
    return {}; // Return an empty object if settings is undefined
  }

  try {
    return JSON.parse(settings);
  } catch (error) {
    console.error("Error parsing settings JSON:", error);
    return {};
  }
}
