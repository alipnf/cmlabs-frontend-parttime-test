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
    <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12">
      <header className="space-y-4 text-center">
        <div className="flex justify-center gap-2 text-xl">
          <span>🍲</span>
          <span>🥣</span>
          <span>🍪</span>
        </div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          mealapp API website
        </p>
        <h1 className="text-4xl font-bold text-[#1D2B4F] md:text-5xl lg:text-6xl text-balance">
          See All The Delicious Foods
        </h1>
      </header>

      <IngredientsList ingredients={ingredients} />
    </main>
  )
}
