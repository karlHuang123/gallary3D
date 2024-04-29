import http from '../utils/http'

export interface DeptItem {
  id: ID
  name: string
  productNum: number
}

export async function getDepts(): Promise<DeptItem[]> {
  const { data } = await http.get<SkdResponse<DeptItem[]>>(
    '/pub/listAllCatalog'
  )
  const depts = data?.data?.reverse()
  return depts
}
