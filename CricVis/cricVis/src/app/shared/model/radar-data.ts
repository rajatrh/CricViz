import { PlayerScore } from './player-score';

export class RadarData {
    actual = []
    scaled = []
    descMap = new Map<Number, String>()

    constructor() {
        this.descMap.set(0, 'Batting Average')
        this.descMap.set(1, 'Batting SR')
        this.descMap.set(2, 'Average Boundaries')
        this.descMap.set(3, 'Bowling Economy')
        this.descMap.set(4, 'Average Wickets')
        this.descMap.set(5, 'Batting FS')
        this.descMap.set(6, 'Bowling FS')
    }

    getDescription(key) {
        return this.descMap.get(key)
    }

    getValues(ps: PlayerScore[]) {
        this.actual = []
        this.scaled = []
        let bl_average = 45.0
        let bl_bt_strikrate = 90.0
        let bl_boundaries = 4



        if (ps.length > 0) {
            let notOutCount = 0

            let sumOfRuns = 0
            let sumStrikeRate = 0.0
            let boundaries = 0;

            let economy = 0;
            let sumOfWickets = 0;

            let battingFSSum = 0;
            let bowlingFSSum = 0;

            let wInnings = 0
            let battingCount = 0
            let bowlingCount = 0
            let bl_economy = 6.0
            let bl_sumOfWickets = 3.0

            ps.forEach(inn => {
                if (inn.isOut) {
                    notOutCount += 1
                }
                sumOfRuns += inn.r

                if (inn.sr) {
                    sumStrikeRate = (sumStrikeRate + +inn.sr)
                }

                if (inn.fours) {
                    boundaries += inn.fours
                }
                if (inn.sixes) {
                    boundaries += inn.sixes
                }

                if (inn.e || inn.w) {
                    economy += +inn.e
                    sumOfWickets += inn.w
                    wInnings += 1
                }
                if (inn.bat_score) {
                    battingFSSum += inn.bat_score
                    battingCount += 1
                }
                if (inn.sixes) {
                    bowlingFSSum += inn.bowl_score
                    bowlingCount += 1
                }

            })

            this.actual.push(Math.round((sumOfRuns / notOutCount) * 100) / 100)
            this.scaled.push(Math.round(((sumOfRuns / notOutCount) / bl_average) * 100.0))

            this.actual.push(Math.round((sumStrikeRate / ps.length) * 100) / 100)
            this.scaled.push(Math.round(((sumStrikeRate / ps.length) / bl_bt_strikrate) * 100.0))

            this.actual.push(Math.round((boundaries / ps.length) * 100) / 100)
            this.scaled.push((Math.round(((boundaries / ps.length) / bl_boundaries) * 100.0)))

            //---

            this.actual.push(Math.round((economy / wInnings) * 100) / 100)
            this.scaled.push(Math.round(((economy / wInnings) / bl_economy) * 100.0))

            this.actual.push(Math.round((sumOfWickets / wInnings) * 100) / 100)
            this.scaled.push(Math.round(((sumOfWickets / wInnings) / bl_sumOfWickets) * 100.0))

        }
    }
}