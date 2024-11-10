import { FitEvent } from './events/fit-event'
import { FitRecord } from './fit-record'
import { Lap } from './lap'
import { UserProfile } from './user-profile'
import { ZonesTarget } from './zones-target'

export interface ListedFit {
    records: FitRecord[]
    laps: Lap[]
    events?: FitEvent[]
    user_profile: UserProfile
    zones_target: ZonesTarget
}
