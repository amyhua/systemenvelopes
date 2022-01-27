const API_URL = process.env.API_URL || 'http://localhost:5000'

const patchFetch = (path: string, body: any) =>
  fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export const updateBudgetItem = (id: number | string, body: any = {}) => {
  return patchFetch(`/budget_items/${id}`, body)
}
