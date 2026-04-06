import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getMealDetail, getRecipeItems } from "@/lib/api"

type MealDetailPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    category?: string
  }>
}

function getYoutubeEmbedUrl(url: string | null): string | null {
  if (!url) {
    return null
  }

  try {
    const parsedUrl = new URL(url)
    const videoId = parsedUrl.searchParams.get("v")

    if (!videoId) {
      return null
    }

    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: MealDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const meal = await getMealDetail(id)

  return {
    title: meal ? meal.strMeal : "Meal Not Found",
    description: meal
      ? `Detail recipe and tutorial for ${meal.strMeal}`
      : "Meal detail is not available",
  }
}

export default async function MealDetailPage({ params, searchParams }: MealDetailPageProps) {
  const { id } = await params
  const { category } = await searchParams
  
  const meal = await getMealDetail(id)

  if (!meal) {
    notFound()
  }

  const recipeItems = getRecipeItems(meal)
  const youtubeEmbedUrl = getYoutubeEmbedUrl(meal.strYoutube)
  
  const actualCategory = category ? decodeURIComponent(category) : meal.strCategory || "Category"

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/ingredients">Foods</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/ingredients/${encodeURIComponent(actualCategory)}`}>{actualCategory}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{meal.strMeal}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-[#1D2B4F] md:text-5xl">
          {meal.strMeal}
        </h1>
        <Separator className="mt-4" />
      </div>

      {meal.strArea && (
        <div className="text-sm font-bold text-[#e15b64] mb-2 tracking-wide">
          {meal.strArea} Culinary
        </div>
      )}

      <section className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl shadow-sm border">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              width={800}
              height={800}
              className="h-auto w-full object-cover aspect-square"
              priority
            />
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-3xl font-normal text-[#1D2B4F]">Instructions</h2>
            <div className="leading-relaxed whitespace-pre-line text-sm text-foreground/80 font-serif">
              {meal.strInstructions}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-normal text-[#1D2B4F]">Recipes</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80 font-serif">
              {recipeItems.map((item) => (
                <li key={`${item.ingredient}-${item.measure}`}>
                  {item.measure} {item.ingredient}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      {youtubeEmbedUrl && (
        <section className="space-y-6 pt-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-normal text-[#1D2B4F]">Tutorials</h2>
          <div className="aspect-video overflow-hidden rounded-2xl shadow-md border bg-muted">
            <iframe
              src={youtubeEmbedUrl}
              title={`Youtube tutorial for ${meal.strMeal}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </main>
  )
}
