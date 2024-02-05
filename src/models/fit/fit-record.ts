import { LeftRightBalance } from './left-right-balance'

export interface FitRecord {
    timestamp: Date

    [key: string]: unknown

    position_lat?: number
    position_long?: number
    altitude?: number
    heart_rate?: number
    cadence?: number
    distance?: number
    speed?: number
    power?: number
    compressed_speed_distance?: number
    grade?: number
    resistance?: number
    time_from_course?: number
    cycle_length?: number
    temperature?: number
    speed_1s?: number
    cycles?: number
    total_cycles?: number
    compressed_accumulated_power?: number
    accumulated_power?: number
    left_right_balance?: LeftRightBalance
    gps_accuracy?: number
    vertical_speed?: number
    calories?: number
    vertical_oscillation?: number
    stance_time_percent?: number
    stance_time?: number
    activity_type?: number
    left_torque_effectiveness?: number
    right_torque_effectiveness?: number
    left_pedal_smoothness?: number
    right_pedal_smoothness?: number
    combined_pedal_smoothness?: number
    time128?: number
    stroke_type?: number
    zone?: number
    ball_speed?: number
    cadence256?: number
    fractional_cadence?: number
    total_hemoglobin_conc?: number
    total_hemoglobin_conc_min?: number
    total_hemoglobin_conc_max?: number
    saturated_hemoglobin_percent?: number
    saturated_hemoglobin_percent_min?: number
    saturated_hemoglobin_percent_max?: number
    device_index?: number
    left_pco?: number
    right_pco?: number
    left_power_phase?: number
    left_power_phase_peak?: number
    right_power_phase?: number
    right_power_phase_peak?: number
    enhanced_speed?: number
    enhanced_altitude?: number
    battery_soc?: number
    motor_power?: number
    vertical_ratio?: number
    stance_time_balance?: number
    step_length?: number
    absolute_pressure?: number
    depth?: number
    next_stop_depth?: number
    next_stop_time?: number
    time_to_surface?: number
    ndl_time?: number
    cns_load?: number
    n2_load?: number
}
