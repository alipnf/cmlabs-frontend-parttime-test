"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import type { Ingredient } from "@/lib/api"

type IngredientsListProps = {
  ingredients: Ingredient[]
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIngredients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return ingredients
    }

    return ingredients.filter((ingredient) =>
      ingredient.strIngredient.toLowerCase().includes(query)
    )
  }, [ingredients, searchTerm])

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="ingredient-search" className="text-sm font-medium">
          Search Ingredients
        </label>
        <input
          id="ingredient-search"
          type="text"
          placeholder="Search by ingredient name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredIngredients.length} of {ingredients.length} ingredients
      </p>

      {filteredIngredients.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No ingredients found for &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIngredients.map((ingredient) => (
            <Link
              key={ingredient.idIngredient}
              href={`/ingredients/${encodeURIComponent(ingredient.strIngredient)}`}
              className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <h2 className="font-semibold">{ingredient.strIngredient}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {ingredient.strDescription || "No description available."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
