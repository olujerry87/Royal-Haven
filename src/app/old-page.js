import { getHomePageData } from "@/lib/wordpress";
import HomeClient from "./HomeClient";
import { RenderBuilderContent } from "@/components/builder";

export const metadata = {
  title: "Royal Haven | Modern Indigenous Fashion & Artistry",
  description: "Experience the duality of Wura (Clothing) and Ewa (Artistry).",
};

export default async function Home() {
  // 1. Try to fetch Builder content for the home page ("/") via REST API
  // This avoids importing the client-side SDK in a Server Component
  const encodedUrl = encodeURIComponent("/");
  const apiKey = "25e5eaee7d1c42fb84ae738159147ca4";

  let builderContent = null;
  try {
    const res = await fetch(
      `https://cdn.builder.io/api/v3/content/page?apiKey=${apiKey}&userAttributes.urlPath=${encodedUrl}&limit=1`,
      { next: { revalidate: 10 } }
    );
    const data = await res.json();
    builderContent = data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error("Error fetching Builder content:", error);
  }

  // 2. Fetch existing WP data (keep for fallback)
  const acfData = await getHomePageData();

  // 3. Render Builder content if found, otherwise fallback to HomeClient
  return (
    <>
      <RenderBuilderContent content={builderContent} model="page">
        <HomeClient acf={acfData} />
      </RenderBuilderContent>
    </>
  );
}
