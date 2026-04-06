"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import type { Ingredient } from "@/lib/api"

import { Input } from "@/components/ui/input"

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
    <section className="space-y-8">
      {/* Optional Search Bar - to preserve functionality but keep out of the main view initially */}
      <div className="mx-auto max-w-xl space-y-2">
        <Input
          id="ingredient-search"
          type="text"
          placeholder="Search foods..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="rounded-full bg-background/50 px-6 py-6 text-sm md:text-base shadow-sm backdrop-blur transition-all focus-visible:ring-2"
        />
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No foods found for &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6 pt-4">
          {filteredIngredients.map((ingredient) => (
            <Link
              key={ingredient.idIngredient}
              href={`/ingredients/${encodeURIComponent(ingredient.strIngredient)}`}
              className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-muted transition-transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <Image
                src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
                alt={ingredient.strIngredient}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <h2 className="relative z-10 text-xl font-bold text-white tracking-wide text-center px-2">
                {ingredient.strIngredient}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
