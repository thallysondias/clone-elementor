import { parse, HTMLElement } from "node-html-parser";

export default async function GetStyles(websiteData: string) {
  const root = parse(websiteData);
  const headElement = root.querySelector("head");

  if (headElement) {
    // First, try to find elementor CSS links
    let linkElements = headElement.querySelectorAll(
      "link[id^=elementor-post-]"
    );

    // If no elementor links are found, look for the combined CSS file
    if (linkElements.length === 0) {
      const combinedCssLink = headElement.querySelector(
        "link[id^='wpacu-combined-css-head-']"
      );
      if (combinedCssLink) {
        linkElements = [combinedCssLink]; // Use the combined CSS link
      }
    }

    const fetchPromises = linkElements.map((link) => {
      const href = link.getAttribute("href");
      return href ? fetchCss(href) : Promise.resolve("");
    });

    try {
      const cssContents = await Promise.all(fetchPromises);
      return cssContents.join("\n");
    } catch (error) {
      console.error("Error fetching CSS:", error);
      return "";
    }
  }

  return "";
}

async function fetchCss(href: string) {
  try {
    const response = await fetch(href, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching CSS from ${href}:`, error);
    return "";
  }
}
