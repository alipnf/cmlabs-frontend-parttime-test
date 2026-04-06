import Link from "next/link"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-4 py-10">
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">TheMealDB Explorer</h1>
        <p className="mt-2 text-muted-foreground">
          Front-end test project with Next.js and shadcn style components.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/ingredients"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Open Ingredients Page
          </Link>
        </div>
      </div>
    </main>
  )
}
