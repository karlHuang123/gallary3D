import http from '../utils/http'

export interface ShowNums {
  goodNum: number
  readNum: number
  shareNum: number
  viewerNum: number
}

export async function listAllShowNum(): Promise<ShowNums> {
  const { data } = await http.get<SkdResponse<ShowNums>>('/pub/listAllShowNum')
  return data.data
}

export async function addGoodNum(workId: ID): Promise<void> {
  await http.post('/pub/addGoodNum', null, {
    params: {
      prodId: workId,
    },
  })
}

export async function addReadNum(workId: ID): Promise<void> {
  await http.post('/pub/addReadNum', null, {
    params: {
      prodId: workId,
    },
  })
}

export async function addShareNum(workId: ID): Promise<void> {
  await http.post('/pub/addShareNum', null, {
    params: {
      prodId: workId,
    },
  })
}

export async function addViewerNum(): Promise<void> {
  await http.post('/pub/addViewerNum')
}
