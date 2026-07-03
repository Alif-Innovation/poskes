import { useEffect, useState } from 'react'

interface UseFetchState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

/** Minimal reusable fetch hook for read-only GET requests against the app API. */
export function useFetch<T>(url: string | null, deps: unknown[] = []): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({ data: null, error: null, isLoading: !!url })

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        return (await res.json()) as T
      })
      .then((data) => setState({ data, error: null, isLoading: false }))
      .catch((error: Error) => {
        if (error.name === 'AbortError') return
        setState({ data: null, error, isLoading: false })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps])

  return state
}
