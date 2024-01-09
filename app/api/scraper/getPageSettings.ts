import * as cheerio from "cheerio";
import { PageSettings } from "@/lib/interface";

export default async function GetPageSettings(
  getAllCss: any,
  websiteData: string
) {
  const pageId: string | null = getPageId(websiteData);
  if (pageId) {
    const pageStyleFiltered = stylePageSettings(getAllCss, pageId);
    const pageSettings = pageSettingsconstructor(pageStyleFiltered);

    return pageSettings;
  } else {
    console.log("Page ID not found");
  }
}

export function pageSettingsconstructor(pageStyleFiltered: any) {
  const styles = pageStyleFiltered;

  const jsonPageSettings: { page_settings: PageSettings } = {
    page_settings: {},
  };

  //Background Color
  if (styles["background-color"]) {
    jsonPageSettings.page_settings.background_color =
      styles["background-color"];
  }

  //Background Image
  if (styles["background-image"]) {
    if (
      styles["background-image"].includes("linear-gradient") ||
      styles["background-image"].includes("radial-gradient")
    ) {
      const infoGradientStyle = styles["background-image"];

      const isLinearGradient = infoGradientStyle.includes("linear-gradient");
      const gradientType = isLinearGradient ? "linear" : "radial";

      const gradientRegex =
        /linear-gradient\((\d+)deg, (#\w{6}) (\d+)%, (#\w{6}) (\d+)%\)/;
      const match = infoGradientStyle.match(gradientRegex);

      if (match) {
        const backgroundGradientAngle = match[1];
        const backgroundColor = match[2];
        const backgroundColorStop = match[3];
        const backgroundColorB = match[4];

        // Construindo o objeto JSON
        jsonPageSettings.page_settings = {
          background_background: "gradient",
          background_color: backgroundColor,
          background_color_stop: {
            unit: "%",
            size: backgroundColorStop,
            sizes: [],
          },
          background_color_b: backgroundColorB,
          background_gradient_angle: {
            unit: "deg",
            size: backgroundGradientAngle,
            sizes: [],
          },
          background_gradient_type: gradientType,
        };
      }
    } else {
      jsonPageSettings.page_settings.background_background = "classic";

      if (styles["background-image"].includes("url")) {
        const urlRegex = /url\("([^"]+)"\)/;
        const match = styles["background-image"].match(urlRegex);
        if (match) {
          jsonPageSettings.page_settings.background_image = {
            url: match[1],
            source: "url",
          };
        }
      }
    }

    if (styles["background-position"]) {
      jsonPageSettings.page_settings.background_position =
        styles["background-position"];
    }
    if (styles["background-position"]) {
      jsonPageSettings.page_settings.background_position =
        styles["background-position"];
    }
    if (styles["background-repeat"]) {
      jsonPageSettings.page_settings.background_repeat =
        styles["background-repeat"];
    }
    if (styles["background-size"]) {
      jsonPageSettings.page_settings.background_size =
        styles["background-size"];
    }
    if (styles["background-attachment"]) {
      jsonPageSettings.page_settings.background_attachment =
        styles["background-attachment"];
    }
  }

  if (styles.margin) {
    jsonPageSettings.page_settings.margin = {
      unit: "px",
      top: styles.margin.split(" ")[0].replace("px", ""),
      right: styles.margin.split(" ")[1].replace("px", ""),
      bottom: styles.margin.split(" ")[2].replace("px", ""),
      left: styles.margin.split(" ")[3].replace("px", ""),
      isLinked: new Set(styles.margin.split(" ")).size === 1,
    };
  }

  if (styles.padding) {
    jsonPageSettings.page_settings.padding = {
      unit: "px",
      top: styles.padding.split(" ")[0].replace("px", ""),
      right: styles.padding.split(" ")[1].replace("px", ""),
      bottom: styles.padding.split(" ")[2].replace("px", ""),
      left: styles.padding.split(" ")[3].replace("px", ""),
      isLinked: new Set(styles.padding.split(" ")).size === 1,
    };
  }

  console.log(jsonPageSettings);

  return jsonPageSettings;
}

export function getPageId(websiteData: string): string | null {
  const $ = cheerio.load(websiteData);
  const bodyClass: string | undefined = $("body").attr("class");
  if (!bodyClass) return null;

  const pageIdMatch = /elementor-page-(\d+)/.exec(bodyClass);
  if (pageIdMatch && pageIdMatch.length > 1) {
    return pageIdMatch[0];
  } else {
    return null;
  }
}

export function stylePageSettings(getAllCss: any, pageId: string) {
  const styles: any = {};
  const pattern = new RegExp(`body\\.${pageId}[^{]*\\{([^\\}]*)\\}`, "g");

  let match;

  while ((match = pattern.exec(getAllCss)) !== null) {
    const properties = match[1]
      .split(";")
      .map((prop) => prop.trim())
      .filter((prop) => prop);
    properties.forEach((property) => {
      const indexOfFirstColon = property.indexOf(":");
      const key = property.substring(0, indexOfFirstColon).trim();
      const value = property.substring(indexOfFirstColon + 1).trim();
      if (key && value) {
        styles[key] = value;
      }
    });
  }
  return styles;
}
