"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import type { Ingredient } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

type IngredientsListProps = {
  ingredients: Ingredient[]
}

const ITEMS_PER_PAGE = 24

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  // Debounce the search input to improve performance when typing fast
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const filteredIngredients = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase()

    if (!query) {
      return ingredients
    }

    return ingredients.filter((ingredient) =>
      ingredient.strIngredient.toLowerCase().includes(query)
    )
  }, [ingredients, debouncedSearchTerm])

  // Reset pagination when search query changes
  useMemo(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [debouncedSearchTerm])

  const visibleIngredients = filteredIngredients.slice(0, visibleCount)
  const hasMore = visibleCount < filteredIngredients.length

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
          id="ingredient-search"
          type="text"
          placeholder="Search foods..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="rounded-full border-0 bg-transparent px-4 py-6 text-sm md:text-base shadow-none focus-visible:ring-0"
        />
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No foods found for &quot;{debouncedSearchTerm}&quot;.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {visibleIngredients.map((ingredient) => (
              <Link
                key={ingredient.idIngredient}
                href={`/ingredients/${encodeURIComponent(ingredient.strIngredient)}`}
                className="group relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl bg-muted transition-transform hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-xl"
              >
                {/* Skeleton Loader Background */}
                <div 
                  className={`absolute inset-0 bg-secondary/50 animate-pulse ${
                    loadedImages[ingredient.idIngredient] ? 'hidden' : 'block'
                  }`}
                />
                
                <Image
                  src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
                  alt={ingredient.strIngredient}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  onLoad={() => handleImageLoad(ingredient.idIngredient)}
                  className={`object-cover transition-all duration-700 ${
                    loadedImages[ingredient.idIngredient] 
                      ? 'scale-100 opacity-100 group-hover:scale-110' 
                      : 'scale-95 opacity-0'
                  }`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                <h2 className="relative z-10 text-lg sm:text-xl font-bold text-white tracking-wide text-center px-2">
                  {ingredient.strIngredient}
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
                Load More Foods
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
