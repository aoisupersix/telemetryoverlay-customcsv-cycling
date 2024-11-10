[![CI](https://github.com/aoisupersix/telemetryoverlay-customcsv-cycling/actions/workflows/ci.yml/badge.svg)](https://github.com/aoisupersix/telemetryoverlay-customcsv-cycling/actions/workflows/ci.yml)

# telemetryoverlay-customcsv-cycling

A tool to calculate various useful metrics used on cycling from [fit files](https://developer.garmin.com/fit/overview/), and output them to a custom CSV in [telemetry-overlay](https://goprotelemetryextractor.com/tools-for-custom-csv).

## Application

https://aoisupersix.github.io/telemetryoverlay-customcsv-cycling/

## Calculated metrics

| Name                            | Column name                  | Unit(format) | Remarks                                                                                                                    |
| ------------------------------- | ---------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| FTP(Functional threshold power) | ftp                          | w            |                                                                                                                            |
| Weight                          | weight                       | kg           |                                                                                                                            |
| Lap number                      | lap_number                   | number       | Number of laps on the cyclocomputer.                                                                                       |
| Lap time                        | lap_time (s)                 | seconds      |                                                                                                                            |
| Power                           | power                        | w            | Since the power of the FIT file is not recorded in some records in some cases, the value is set as 0w when no data exists. |
| PWR(Power weight ratio)         | power_weight_ratio           | number       | Power / Weight                                                                                                             |
| Left power                      | left_power (W)               | w            |                                                                                                                            |
| Right power                     | right_power (W)              | w            |                                                                                                                            |
| Power FTP ratio                 | power_ftp_ratio (%)          | %            | Ratio of power to FTP. For example, if the FTP is 200w and the power is 100w, 50%.                                         |
| Left power balance              | left_power_balance (%)       | %            |                                                                                                                            |
| Right power balance             | right_power_balance (%)      | %            |                                                                                                                            |
| Left right power balance        | left_right_power_balance (%) | %            |                                                                                                                            |
| Left PCO                        | left_pco (mm)                | mm           | Platform center offset (left) output by Garmin Rally, etc.                                                                 |
| Right PCO                       | right_pco (mm)               | mm           |                                                                                                                            |
| Sitting/Dancing                 | rider_position               | number       | 0 for sitting, 1 for dancing. Calculated from the “rider_position_change” event output by Garmin Rally, etc.               |
| Training zone                   | training_zone                | (string)     | Name of training zone for cycling power zone defined.                                                                      |
| Training zone(日本語)              | training_zone_jp             | (string)     |                                                                                                                            |
| Training zone level             | training_zone_level          | (string)     |                                                                                                                            |

## Development

```sh
npm install
npm run start # Start development server
npm run build # Build for production
```

## License

This project is licensed under the MIT License - see the [license](./license) file for details
