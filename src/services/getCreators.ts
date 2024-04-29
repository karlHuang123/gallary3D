import http from '../utils/http'

export interface CreatorItem {
  id: ID
  name: string
  awards: string
  degree: string
  collegeName: string
  headImageUrl: string
}

export async function getCreators(): Promise<CreatorItem[]> {
  const { data } = await http.get<SkdResponse<CreatorItem[]>>(
    '/pub/listAllStudent'
  )
  const creators = data?.data
  return creators
}
