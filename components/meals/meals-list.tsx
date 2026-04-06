"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import type { MealSummary } from "@/lib/api"

type MealsListProps = {
  meals: MealSummary[]
}

export function MealsList({ meals }: MealsListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMeals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return meals
    }

    return meals.filter((meal) => meal.strMeal.toLowerCase().includes(query))
  }, [meals, searchTerm])

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="meal-search" className="text-sm font-medium">
          Search Meal
        </label>
        <input
          id="meal-search"
          type="text"
          placeholder="Search by meal name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredMeals.length} of {meals.length} meals
      </p>

      {filteredMeals.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No meals found for &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((meal) => (
            <Link
              key={meal.idMeal}
              href={`/meal/${meal.idMeal}`}
              className="overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
            >
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="line-clamp-2 font-semibold">{meal.strMeal}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
