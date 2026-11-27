import { useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>(() => ({
    data: null,
    loading: url !== null,
    error: null,
  }))

  useEffect(() => {
    if (!url) return

    const requestUrl = url
    const controller = new AbortController()

    async function load() {
      setState((current) => ({ ...current, loading: true, error: null }))
      try {
        const response = await fetch(requestUrl, { signal: controller.signal })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        const data = (await response.json()) as T
        setState({ data, loading: false, error: null })
      } catch (error) {
        if (controller.signal.aborted) return
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Unable to load data'),
        })
      }
    }

    void load()
    return () => controller.abort()
  }, [url])

  return state
}
