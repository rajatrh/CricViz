import { PlayerScore } from './player-score';

export class RadarData {
    actual = []
    scaled = []
    descMap = new Map<Number, String>()

    constructor() {
        this.descMap.set(0, 'Average')
        this.descMap.set(1, 'Batting SR')
        this.descMap.set(2, 'Average Boundaries')
        // this.descMap.set('batfs', 'Batting FS')
        // this.descMap.set('bowlfs', 'Bowling FS')
        // this.descMap.set('economy', 'Bowling Economy')
        // this.descMap.set('batfs', 'Batting FS')
        // this.descMap.set('bowlfs', 'Bowling FS')
        // this.descMap.set('economy', 'Bowling Economy')
        
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
            })
            this.actual.push(Math.round((sumOfRuns / notOutCount) * 100)/100)

            this.scaled.push(Math.round(((sumOfRuns / notOutCount)/bl_average) * 100.0))

            this.actual.push(Math.round((sumStrikeRate / ps.length) * 100)/100)
            this.scaled.push(Math.round(((sumStrikeRate / ps.length) /bl_bt_strikrate) * 100.0))
    
            this.actual.push(Math.round((boundaries / ps.length) * 100)/100)
            this.scaled.push((Math.round(((boundaries / ps.length)/ bl_boundaries) * 100.0)))
        }
    }
}