import { FitRecord } from './fit-record'
import { UserProfile } from './user-profile'

export interface ListedFit {
    records: FitRecord[]
    user_profile: UserProfile
}
