import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getMealDetail, getRecipeItems } from "@/lib/api"

type MealDetailPageProps = {
  params: Promise<{
    id: string
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

export default async function MealDetailPage({ params }: MealDetailPageProps) {
  const { id } = await params
  const meal = await getMealDetail(id)

  if (!meal) {
    notFound()
  }

  const recipeItems = getRecipeItems(meal)
  const youtubeEmbedUrl = getYoutubeEmbedUrl(meal.strYoutube)

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/ingredients"
        className="inline-flex rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
      >
        Back to Ingredients
      </Link>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            width={800}
            height={600}
            className="h-auto w-full rounded-xl border object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold md:text-3xl">{meal.strMeal}</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Recipe details, tutorial, and ingredient measurements.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Recipe</h2>
            <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {recipeItems.map((item) => (
                <li
                  key={`${item.ingredient}-${item.measure}`}
                  className="rounded-md border p-2"
                >
                  <span className="font-medium">{item.ingredient}</span>:{" "}
                  {item.measure}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Tutorial / Instructions</h2>
        <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
          {meal.strInstructions}
        </p>
      </section>

      {youtubeEmbedUrl ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Youtube Embedded</h2>
          <div className="aspect-video overflow-hidden rounded-xl border">
            <iframe
              src={youtubeEmbedUrl}
              title={`Youtube tutorial for ${meal.strMeal}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}
    </main>
  )
}
