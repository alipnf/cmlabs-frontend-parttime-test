export type Ingredient = {
  idIngredient: string
  strIngredient: string
  strDescription: string | null
  strType: string | null
}

export type MealSummary = {
  idMeal: string
  strMeal: string
  strMealThumb: string
}

export type MealDetail = {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
  strYoutube: string | null
  [key: string]: string | null
}

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1"

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`)
  }

  return (await response.json()) as T
}

export async function getIngredients(): Promise<Ingredient[]> {
  const result = await fetchJson<{ meals: Ingredient[] | null }>(
    "/list.php?i=list"
  )
  return result.meals ?? []
}

export async function getMealsByIngredient(
  ingredientName: string
): Promise<MealSummary[]> {
  const encodedIngredient = encodeURIComponent(ingredientName)
  const result = await fetchJson<{ meals: MealSummary[] | null }>(
    `/filter.php?i=${encodedIngredient}`
  )

  return result.meals ?? []
}

export async function getMealDetail(
  mealId: string
): Promise<MealDetail | null> {
  const encodedMealId = encodeURIComponent(mealId)
  const result = await fetchJson<{ meals: MealDetail[] | null }>(
    `/lookup.php?i=${encodedMealId}`
  )

  return result.meals?.[0] ?? null
}

export function getRecipeItems(
  meal: MealDetail
): Array<{ ingredient: string; measure: string }> {
  const items: Array<{ ingredient: string; measure: string }> = []

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim()
    const measure = meal[`strMeasure${index}`]?.trim()

    if (ingredient) {
      items.push({
        ingredient,
        measure: measure || "-",
      })
    }
  }

  return items
}
