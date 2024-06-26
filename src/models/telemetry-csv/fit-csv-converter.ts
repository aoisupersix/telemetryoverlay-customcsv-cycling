import dayjs from 'dayjs'
import { sortBy } from 'lodash'

import { TelemetryCsv } from './telemetry-csv'
import {
    RiderPositionChangeEvent,
    RiderPositionType,
    isRiderPositionChangeEvent,
} from '../fit/events/rider-position-change-event'
import { FitRecord } from '../fit/fit-record'
import { Lap } from '../fit/lap'
import { ListedFit } from '../fit/listed-fit'

export const convertToTelemetryCsv = (
    fit: ListedFit,
    weight: number,
): [TelemetryCsv, string[]] => {
    const descOrderedPositionChangeEvents = sortBy(
        fit.events ?? [],
        (e) => e.timestamp,
    )
        .reverse()
        .filter((e) =>
            isRiderPositionChangeEvent(e),
        ) as RiderPositionChangeEvent[]
    const laps = sortBy(fit.laps, (l) => l.timestamp).map((l, i) => {
        return {
            number: i + 1,
            record: l,
        }
    })
    const telemetryRecords = fit.records.map((r) => {
        const lastPositionChangeEvent = descOrderedPositionChangeEvents.find(
            (e) => e.timestamp <= r.timestamp,
        )
        const lap = laps.findLast((l) => r.timestamp >= l.record.start_time)
        return convertToTelemetryRecord(
            r,
            lap.record,
            lap.number,
            weight,
            lastPositionChangeEvent,
        )
    })
    const fields = telemetryRecords
        .flatMap((r) => Object.keys(r))
        .filter((r1, i, arr) => arr.findIndex((r2) => r2 === r1) === i)
    return [telemetryRecords, fields]
}

const convertToTelemetryRecord = (
    fitRecord: FitRecord,
    lap: Lap,
    lapNumber: number,
    weight: number,
    lastPositionChangeEvent?: RiderPositionChangeEvent,
) => {
    let record: { [key: string]: unknown } = {
        date: fitRecord.timestamp.toISOString(),
        weight: weight,
        'lap number': lapNumber,
        'lap time (s)': dayjs(fitRecord.timestamp).diff(
            lap.start_time,
            'seconds',
            true,
        ),
        // Power is set at 0 even if no data exists in the FIT file.
        power: 0,
        'power weight ratio': 0,
        'left power (W)': 0,
        'right power (W)': 0,
    }

    if (fitRecord.position_lat) {
        record['lat (deg)'] = fitRecord.position_lat
    }
    if (fitRecord.position_long) {
        record['lon (deg)'] = fitRecord.position_long
    }
    if (fitRecord.speed) {
        record['speed (km/h)'] = fitRecord.speed
    }
    if (fitRecord.heart_rate) {
        record['heart rate (bpm)'] = fitRecord.heart_rate
    }
    if (fitRecord.cadence) {
        record['cadence (rpm)'] = fitRecord.cadence
    }
    if (fitRecord.temperature) {
        record['temperature (°C)'] = fitRecord.temperature
    }
    if (fitRecord.power) {
        record['power weight ratio'] = fitRecord.power / weight

        if (
            fitRecord.left_right_balance &&
            fitRecord.left_right_balance.right
        ) {
            const leftBalance = fitRecord.left_right_balance.value
            const rightBalance = 100 - leftBalance
            const balance = 50 - leftBalance
            record = {
                ...record,
                'left power balance (%)': leftBalance,
                'right power balance (%)': rightBalance,
                'left right power balance (%)': balance,
                'left power (W)': fitRecord.power * (leftBalance / 100),
                'right power (W)': fitRecord.power * (rightBalance / 100),
            }
        }
    }
    if (fitRecord.left_pco) {
        record['left pco (mm)'] = fitRecord.left_pco
    }
    if (fitRecord.right_pco) {
        record['right pco (mm)'] = fitRecord.right_pco
    }

    if (lastPositionChangeEvent) {
        switch (lastPositionChangeEvent.data) {
            case RiderPositionType.Seated:
            case RiderPositionType.TransitionToSeated:
                record['rider position'] = 0
                break
            case RiderPositionType.Standing:
            case RiderPositionType.TransitionToStanding:
                record['rider position'] = 1
                break
        }
    }

    for (const key of Object.keys(fitRecord)) {
        if (!copySkippingKeys.includes(key) && !Number.isNaN(fitRecord[key])) {
            record[key] = fitRecord[key]
        }
    }

    return record
}

const copySkippingKeys = [
    'timestamp',
    'position_lat',
    'position_long',
    'heart_rate',
    'cadence',
    'temperature',
    'power',
    'left_right_balance',
    'left_pco',
    'right_pco',
]
