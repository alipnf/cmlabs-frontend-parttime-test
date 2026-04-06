import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/ingredients">Foods</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ingredientName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-[#1D2B4F] dark:text-white md:text-5xl">
          {ingredientName} Meals
        </h1>
        <Separator className="mt-4" />
      </div>

      <div className="pt-4">
        <MealsList meals={meals} />
      </div>
    </main>
  )
}
