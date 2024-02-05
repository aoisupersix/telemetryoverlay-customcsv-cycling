type Gender = 'male' | 'female'
type DisplayMeasure = 'metric' | 'statute' | 'nautical'
type DisplayHeart = 'bpm' | 'max' | 'reserve'
type DisplayPower = 'watts' | 'percentFtp'
type DisplayPosition =
    | 'degree'
    | 'degreeMinute'
    | 'degreeMinuteSecond'
    | 'austrianGrid'
    | 'britishGrid'
    | 'dutchGrid'
    | 'hungarianGrid'
    | 'finnishGrid'
    | 'germanGrid'
    | 'icelandicGrid'
    | 'indonesianEquatorial'
    | 'indonesianIrian'
    | 'indonesianSouthern'
    | 'indiaZone0'
    | 'indiaZoneIA'
    | 'indiaZoneIB'
    | 'indiaZoneIIA'
    | 'indiaZoneIIB'
    | 'indiaZoneIIIA'
    | 'indiaZoneIIIB'
    | 'indiaZoneIVA'
    | 'indiaZoneIVB'
    | 'irishTransverse'
    | 'irishGrid'
    | 'loran'
    | 'maidenheadGrid'
    | 'mgrsGrid'
    | 'newZealandGrid'
    | 'newZealandTransverse'
    | 'qatarGrid'
    | 'modifiedSwedishGrid'
    | 'swedishGrid'
    | 'southAfricanGrid'
    | 'swissGrid'
    | 'taiwanGrid'
    | 'unitedStatesGrid'
    | 'utmUpsGrid'
    | 'westMalayan'
    | 'borneoRso'
    | 'estonianGrid'
    | 'latvianGrid'
    | 'swedishRef99Grid'
type UserLocalId =
    | 'localMin'
    | 'localMax'
    | 'stationaryMin'
    | 'stationaryMax'
    | 'portableMin'
    | 'portableMax'

export interface UserProfile {
    [key: string]: unknown

    friendly_name?: string
    gender?: Gender
    age?: number
    height?: number
    weight?: number
    language?: string
    elev_setting?: DisplayMeasure
    weight_setting?: DisplayMeasure
    resting_heart_rate?: number
    default_max_running_heart_rate?: number
    default_max_biking_heart_rate?: number
    default_max_heart_rate?: number
    hr_setting?: DisplayHeart
    speed_setting?: DisplayMeasure
    dist_setting?: DisplayMeasure
    power_setting?: DisplayPower
    activity_class?: number
    position_setting?: DisplayPosition
    temperature_setting?: DisplayMeasure
    local_id?: UserLocalId
    global_id?: ArrayBuffer
    height_setting?: DisplayMeasure
    depth_setting?: DisplayMeasure
}
