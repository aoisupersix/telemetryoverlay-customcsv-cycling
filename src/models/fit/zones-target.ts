type HrCalcType = 'custom' | 'percent_max_hr' | 'percent_hrr' | 'percent_lthr'
type PwrCalcType = 'custom' | 'percent_ftp'

export interface ZonesTarget {
    [key: string]: unknown

    message_index?: number
    max_heart_rate?: number
    threshold_heart_rate?: number
    functional_threshold_power?: number
    hr_calc_type?: HrCalcType
    pwr_calc_type?: PwrCalcType
}
