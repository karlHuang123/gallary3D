import http from '../utils/http'
import { useQuery } from '@tanstack/react-query'
import { getDepts } from './getDepts'
import { CreatorItem, getCreators } from './getCreators'

export interface WorkImageItem {
  id: ID
  resImageUrl: string
}

export type OrderBy = 'good_num' | 'share_num' | 'read_num' | undefined

export interface WorkItem {
  id: ID
  name: string
  description: string
  catalogId: ID
  catalogName: string
  studentId: ID
  studentName: string
  goodNum: number
  readNum: number
  shareNum: number
  livePicUrl: string
  picsNum: number
  picsList: WorkImageItem[]
}

export interface WorkWithCreatorInfo extends WorkItem {
  creator: CreatorItem
}

export interface CreatorWithWorkInfo extends CreatorItem {
  depts: ID[]
  works: ID[]
}

export async function getWorks(): Promise<WorkItem[]> {
  const { data } = await http.get<SkdPagedResponse<WorkItem>>(
    '/pub/listProductBySort',
    {
      params: {
        pageNum: 1,
        pageSize: 999,
      },
    }
  )
  const works = data?.items
  return works
}

export const fetchGalleryFn = async () => {
  const depts = await getDepts()
  const creators = await getCreators()
  const allWorks = await getWorks()

  const sortDic = new Map<ID, number>(depts!.map((dept, i) => [dept.id, i]))
  const rank = (work: WorkItem) => sortDic.get(work.catalogId) ?? 0
  const works = allWorks.sort((a, b) => rank(a) - rank(b))

  const creatorDic = new Map<ID, CreatorWithWorkInfo>()
  const workDic = new Map<ID, WorkWithCreatorInfo>()

  const creatorsWithWorkInfo: CreatorWithWorkInfo[] = creators.map((c) => {
    const cWithWorkInfo = { ...c, depts: [], works: [] }
    creatorDic.set(c.id, cWithWorkInfo)
    return cWithWorkInfo
  })

  const worksWithCreatorInfo: WorkWithCreatorInfo[] = works.map((work) => {
    const creator = creatorDic.get(work.studentId)
    if (!creator) {
      throw new Error(`Can not find a student with ID: ${work.studentId}`)
    }
    creator.depts.push(work.catalogId)
    creator.works.push(work.id)
    const workWithCreatorInfo = { ...work, creator }
    workDic.set(work.id, workWithCreatorInfo)
    return workWithCreatorInfo
  })

  return {
    depts,
    creators: creatorsWithWorkInfo,
    works: worksWithCreatorInfo,
    workDic,
    creatorDic,
  }
}

export const useGalleryQuery = () => {
  const { data } = useQuery(['gallery'], fetchGalleryFn, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  return data
}
