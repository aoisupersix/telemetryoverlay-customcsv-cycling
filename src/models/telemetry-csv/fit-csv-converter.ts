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
    ftp: number,
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
            ftp,
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
    ftp: number,
    weight: number,
    lastPositionChangeEvent?: RiderPositionChangeEvent,
) => {
    let record: { [key: string]: unknown } = {
        date: fitRecord.timestamp.toISOString(),
        ftp: ftp,
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
        const ftpPercent = (fitRecord.power / ftp) * 100
        record['power ftp ratio (%)'] = ftpPercent
        // ref: https://www.trainerroad.com/blog/cycling-power-zones-training-zones-explained/
        switch (true) {
            case ftpPercent >= 0 && ftpPercent < 56:
                record['training zone'] = 'Active Recovery'
                record['training zone jp'] = '回復走'
                record['training zone level'] = 'L1'
                record['training zone power'] =
                    `0-${calcIntPower(ftp, 56) - 1}w`
                break
            case ftpPercent >= 56 && ftpPercent < 76:
                record['training zone'] = 'Endurance'
                record['training zone jp'] = '持久走'
                record['training zone level'] = 'L2'
                record['training zone power'] =
                    `${calcIntPower(ftp, 56)}-${calcIntPower(ftp, 76) - 1} w`
                break
            case ftpPercent >= 76 && ftpPercent < 91:
                record['training zone'] = 'Tempo'
                record['training zone jp'] = 'テンポ'
                record['training zone level'] = 'L3'
                record['training zone power'] =
                    `${calcIntPower(ftp, 76)}-${calcIntPower(ftp, 91) - 1} w`
                break
            case ftpPercent >= 91 && ftpPercent < 106:
                record['training zone'] = 'Threshold'
                record['training zone jp'] = '乳酸閾値'
                record['training zone level'] = 'L4'
                record['training zone power'] =
                    `${calcIntPower(ftp, 91)}-${calcIntPower(ftp, 106) - 1} w`
                break
            case ftpPercent >= 106 && ftpPercent < 121:
                record['training zone'] = 'VO2 Max'
                record['training zone jp'] = 'VO2 Max'
                record['training zone level'] = 'L5'
                record['training zone power'] =
                    `${calcIntPower(ftp, 106)}-${calcIntPower(ftp, 121) - 1} w`
                break
            case ftpPercent >= 121:
                record['training zone'] = 'Anaerobic Capacity'
                record['training zone jp'] = '無酸素'
                record['training zone level'] = 'L6'
                record['training zone power'] = `${calcIntPower(ftp, 121)}- w`
                break
            default:
                record['training zone'] = ''
                record['training zone jp'] = ''
                record['training zone level'] = ''
                record['training zone power'] = ''
        }

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

const calcIntPower = (power: number, percent: number) => {
    return Math.round(power * (percent / 100))
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
