import type { Metadata } from "next"

import { IngredientsList } from "@/components/ingredients/ingredients-list"
import { getIngredients } from "@/lib/api"

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Browse and search ingredients from TheMealDB",
}

export default async function IngredientsPage() {
  const ingredients = await getIngredients()

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Ingredients</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Choose one ingredient to see all meals that contain it.
        </p>
      </header>

      <IngredientsList ingredients={ingredients} />
    </main>
  )
}
