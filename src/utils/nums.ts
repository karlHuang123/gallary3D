import {
  addGoodNum,
  addReadNum,
  addShareNum,
  addViewerNum,
} from '@/services/nums'

enum NumType {
  Read = 'read',
  Good = 'good',
  Share = 'share',
}

type WorkTimeTable = {
  [key in NumType]?: number
}

interface TimeTable {
  [workId: ID]: WorkTimeTable
}

type TimeTableWithViewer = TimeTable & {
  viewer?: number
  updatedAt?: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function lessThanADayFrom(ts: number) {
  return Date.now() - ts < DAY_MS
}

class NumsManager {
  static STORAGE_KEY = 'time-table'

  private timeTable: TimeTableWithViewer

  constructor() {
    this.timeTable = this.load()
  }

  private load(): TimeTableWithViewer {
    const jsonStr = localStorage.getItem(NumsManager.STORAGE_KEY)
    if (!jsonStr) return {}
    try {
      const loaded = JSON.parse(jsonStr) as TimeTableWithViewer
      if (!loaded.updatedAt || lessThanADayFrom(loaded.updatedAt)) {
        return loaded
      }
      return {}
    } catch (e) {
      return {}
    }
  }

  private save() {
    this.timeTable.updatedAt = Date.now()
    const jsonStr = JSON.stringify(this.timeTable)
    localStorage.setItem(NumsManager.STORAGE_KEY, jsonStr)
  }

  private hasAdded(type: NumType, workId: ID): boolean {
    const table = this.timeTable[workId]
    if (table && table[type]) {
      return lessThanADayFrom(table[type]!)
    }
    return false
  }

  private markDoneNow(type: NumType, workId: ID) {
    const nowTime = Date.now()
    if (this.timeTable[workId]) {
      this.timeTable[workId][type] = nowTime
    } else {
      this.timeTable[workId] = { [type]: nowTime }
    }
    this.save()
  }

  public async like(workId: ID) {
    if (this.hasLiked(workId)) {
      return false
    }
    await addGoodNum(workId)
    this.markDoneNow(NumType.Good, workId)
    return true
  }

  public async read(workId: ID) {
    if (this.hasRead(workId)) {
      return false
    }
    await addReadNum(workId)
    this.markDoneNow(NumType.Read, workId)
    return true
  }

  public async share(workId: ID) {
    if (this.hasShared(workId)) {
      return false
    }
    await addShareNum(workId)
    this.markDoneNow(NumType.Share, workId)
    return true
  }

  public async view() {
    if (this.hasViewed()) {
      return
    }
    await addViewerNum()
    this.timeTable.viewer = Date.now()
    this.save()
  }

  public hasViewed(): boolean {
    return this.timeTable.viewer
      ? lessThanADayFrom(this.timeTable.viewer)
      : false
  }

  public hasRead(workId: ID): boolean {
    return this.hasAdded(NumType.Read, workId)
  }

  public hasLiked(workId: ID): boolean {
    return this.hasAdded(NumType.Good, workId)
  }

  public hasShared(workId: ID): boolean {
    return this.hasAdded(NumType.Share, workId)
  }
}

export default new NumsManager()
