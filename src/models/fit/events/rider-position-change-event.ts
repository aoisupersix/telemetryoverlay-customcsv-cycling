import { FitEvent } from './fit-event'

export const RiderPositionType = {
    Seated: 0,
    Standing: 1,
    TransitionToSeated: 2,
    TransitionToStanding: 3,
} as const

export type RiderPositionType =
    (typeof RiderPositionType)[keyof typeof RiderPositionType]

export interface RiderPositionChangeEvent extends FitEvent {
    data: RiderPositionType
}

export const isRiderPositionChangeEvent = (
    event: FitEvent,
): event is RiderPositionChangeEvent => event.event === 'rider_position_change'
