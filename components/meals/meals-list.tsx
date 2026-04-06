"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import type { MealSummary } from "@/lib/api"

import { Input } from "@/components/ui/input"

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
    <section className="space-y-8">
      <div className="mx-auto max-w-xl space-y-2">
        <Input
          id="meal-search"
          type="text"
          placeholder="Search by meal name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="rounded-full bg-background/50 px-6 py-6 text-sm md:text-base shadow-sm backdrop-blur transition-all focus-visible:ring-2"
        />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No meals found for &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filteredMeals.map((meal) => (
            <Link
              key={meal.idMeal}
              href={`/meal/${meal.idMeal}?category=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.pathname.split("/").pop() || "" : ""
              )}`}
              className="group relative flex aspect-square sm:aspect-[4/5] items-end justify-center overflow-hidden rounded-2xl bg-muted transition-transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              <h2 className="relative z-10 w-full text-center px-4 pb-6 text-lg font-bold text-white tracking-wide line-clamp-2">
                {meal.strMeal}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
