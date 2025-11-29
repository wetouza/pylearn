import { MetadataRoute } from "next";
import { guides } from "@/data/guides";

const BASE_URL = "https://pylearn.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/guides",
    "/vscode",
    "/typing",
    "/glossary",
    "/trainers",
    "/community",
    "/resources",
    "/goals",
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const guideRoutes = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...guideRoutes];
}
