import { FitEvent } from './events/fit-event'
import { FitRecord } from './fit-record'
import { Lap } from './lap'
import { UserProfile } from './user-profile'

export interface ListedFit {
    records: FitRecord[]
    laps: Lap[]
    events?: FitEvent[]
    user_profile: UserProfile
}
