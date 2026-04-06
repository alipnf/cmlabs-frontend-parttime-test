"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import type { MealSummary } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

type MealsListProps = {
  meals: MealSummary[]
}

const ITEMS_PER_PAGE = 24

export function MealsList({ meals }: MealsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  // Debounce the search input
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredMeals = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase()

    if (!query) {
      return meals
    }

    return meals.filter((meal) => meal.strMeal.toLowerCase().includes(query))
  }, [meals, debouncedSearchTerm])

  useMemo(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [debouncedSearchTerm])

  const visibleMeals = filteredMeals.slice(0, visibleCount)
  const hasMore = visibleCount < filteredMeals.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-xl space-y-2 sticky top-20 z-40 bg-background/80 backdrop-blur-md p-2 rounded-full shadow-sm border">
        <Input
          id="meal-search"
          type="text"
          placeholder="Search by meal name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="rounded-full border-0 bg-transparent px-4 py-6 text-sm md:text-base shadow-none focus-visible:ring-0"
        />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No meals found for &quot;{debouncedSearchTerm}&quot;.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {visibleMeals.map((meal) => (
              <Link
                key={meal.idMeal}
                href={`/meal/${meal.idMeal}?category=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.pathname.split("/").pop() || "" : ""
                )}`}
                className="group relative flex aspect-square sm:aspect-4/5 items-end justify-center overflow-hidden rounded-2xl bg-muted transition-transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-xl"
              >
                <div 
                  className={`absolute inset-0 bg-secondary/50 animate-pulse ${
                    loadedImages[meal.idMeal] ? 'hidden' : 'block'
                  }`}
                />
                
                <Image
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  onLoad={() => handleImageLoad(meal.idMeal)}
                  className={`object-cover transition-all duration-700 ${
                    loadedImages[meal.idMeal] 
                      ? 'scale-100 opacity-100 group-hover:scale-110' 
                      : 'scale-95 opacity-0'
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <h2 className="relative z-10 w-full text-center px-4 pb-4 sm:pb-6 text-base sm:text-lg font-bold text-white tracking-wide line-clamp-2">
                  {meal.strMeal}
                </h2>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8 pb-4">
              <button
                onClick={handleLoadMore}
                className="rounded-full bg-secondary px-8 py-3 text-sm font-semibold hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-sm"
              >
                Load More Meals
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
