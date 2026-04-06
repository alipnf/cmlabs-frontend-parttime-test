import type { Metadata } from "next"
import Link from "next/link"

import { MealsList } from "@/components/meals/meals-list"
import { getMealsByIngredient } from "@/lib/api"

type IngredientDetailPageProps = {
  params: Promise<{
    name: string
  }>
}

export async function generateMetadata({
  params,
}: IngredientDetailPageProps): Promise<Metadata> {
  const { name } = await params
  const ingredientName = decodeURIComponent(name)

  return {
    title: `${ingredientName} Meals`,
    description: `Meals filtered by ingredient: ${ingredientName}`,
  }
}

export default async function IngredientDetailPage({
  params,
}: IngredientDetailPageProps) {
  const { name } = await params
  const ingredientName = decodeURIComponent(name)
  const meals = await getMealsByIngredient(ingredientName)

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">
            Meals with &quot;{ingredientName}&quot;
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Select a meal card to open detail page.
          </p>
        </div>
        <Link
          href="/ingredients"
          className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Back to Ingredients
        </Link>
      </div>

      <MealsList meals={meals} />
    </main>
  )
}
