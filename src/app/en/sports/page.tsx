import { HeaderNavigation } from "@/components/sections/header-navigation";
import SportsBettingInterface from "@/components/sections/sports-betting-interface";
import Footer from "@/components/sections/footer";

export default async function SportsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = (resolvedSearchParams?.page as string) || undefined;
  const sportId = (resolvedSearchParams?.sportId as string) || undefined;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <SportsBettingInterface initialQuery={{ page, sportId }} />
      <Footer />
    </div>
  );
}