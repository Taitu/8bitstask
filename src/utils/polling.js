export const createPollingGenerator = (url, interval) => {
  const fetchData = async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      return response.json()
    } catch (error) {
      throw new Error('Something happend. Please try later')
    }
  }

  return async function* () {
    while (true) {
      try {
        const data = await fetchData()
        yield data
        await new Promise(resolve => setTimeout(resolve, interval))
      } catch (error) {
        yield { error: error.message }
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
  }
}
